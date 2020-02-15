package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"mime"
	"net/http"
	"os"
	"strconv"

	_ "github.com/mattn/go-sqlite3"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"golang.org/x/crypto/bcrypt"
)

var templates *template.Template
var store = sessions.NewCookieStore([]byte("zaak-Avit0"))

//TemplatePage exported
type TemplatePage struct {
	FirstName string
	LastName  string
	Title     string
	Email     string
	Company   string
	UserName  string
	Data      string
	Url       string
}

type JsonMsg struct {
	FirstName string
	LastName  string
	Company   string
	Email     string
	UserName  string
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	// fmt.Fprintf(w, "hello world! it's a web page from GoLang")
	// w.Header().Set("content-type", "text/javascript")
	mime.AddExtensionType(".js", "text/javascript")
	session, _ := store.Get(r, "session")
	_, null := session.Values["username"]
	if !null {
		http.Redirect(w, r, "/login", 302)
		return
	}
	p := TemplatePage{Title: "Home", Data: "here is the index"}
	t, _ := template.ParseFiles("templates/index.html")
	t.Execute(w, p)
}

func profileGetHandler(w http.ResponseWriter, r *http.Request) {
	// mime.AddExtensionType("appcache", "text/cache-manifest")
	session, _ := store.Get(r, "session")
	userNameInterface, null := session.Values["username"]
	if !null {
		http.Redirect(w, r, "/login", 302)
		return
	}
	userName := fmt.Sprintf("%v", userNameInterface)
	db, _ := sql.Open("sqlite3", "./users.db")
	rows, _ := db.Query(`
	SELECT firstName,lastName,email,company FROM users WHERE username = ?
	`, userName)
	var first sql.NullString
	var last sql.NullString
	var eml sql.NullString
	var comp sql.NullString

	var firstName string
	var lastName string
	var email string
	var company string
	var url string

	rows.Next()
	rows.Scan(&first, &last, &eml, &comp)
	rows.Close()
	email = eml.String
	firstName = first.String
	lastName = last.String
	company = comp.String

	_, err := os.Stat("static/avatars/" + userName + ".png")
	if err == nil {
		url = "static/avatars/" + userName + ".png"

	} else if os.IsNotExist(err) {
		url = "static/avatars/default.png"

	}
	fileBytes, err := ioutil.ReadFile(url)
	if err != nil {
		fmt.Println(err)
	}
	err = ioutil.WriteFile("static/avatars/temp.png", fileBytes, 0644)
	if err != nil {
		log.Fatal(err)
	}
	url = "static/avatars/temp.png"

	p := TemplatePage{UserName: userName, Email: email, FirstName: firstName, LastName: lastName, Company: company, Url: url}
	t, _ := template.ParseFiles("templates/profile.html")
	t.Execute(w, p)
}

func profilePostHandler(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session")
	idInterface, null := session.Values["id"]
	if !null {
		http.Redirect(w, r, "/login", 302)
		return
	}
	idString := fmt.Sprintf("%v", idInterface)
	id, _ := strconv.Atoi(idString)
	fmt.Println(id)
	r.ParseForm()
	email := r.PostForm.Get("email")
	firstName := r.PostForm.Get("firstName")
	lastName := r.PostForm.Get("lastName")
	company := r.PostForm.Get("company")
	username := r.PostForm.Get("username")
	password1 := r.PostForm.Get("password1")
	password2 := r.PostForm.Get("password2")

	var hash []byte
	var er error
	cost := bcrypt.DefaultCost
	//compare pass1 & 2 if equal generate hash else ask to type it again
	if password1 != "" && password1 == password2 {
		hash, er = bcrypt.GenerateFromPassword([]byte(password1), cost)
		if er != nil {
			return
		}
	}

	fmt.Println(hash)
	db, _ := sql.Open("sqlite3", "./users.db")
	stmt, _ := db.Prepare(`
	UPDATE users SET firstName=?, lastName=?, company=?, username=?,password=?,email=? WHERE ID=?
	`)
	stmt.Exec(firstName, lastName, company, username, hash, email, id)
	stmt.Close()
	// //**********************
	// type JsonMsg struct {
	// 	FirstName string
	// 	LastName  string
	// 	Company   string
	// 	Email     string
	// 	UserName  string
	// }
	// fmt.Println("Ajaxhandler()")
	// decoder := json.NewDecoder(r.Body)

	// var data JsonMsg
	// err := decoder.Decode(&data)
	// if err != nil {
	// 	fmt.Println("jeson decoding error")
	// 	return
	// }

	// fmt.Println("fn:", data.FirstName, "ln:", data.LastName, "comp:", data.Company, "eml:", data.Email, "un:", data.UserName)
	// fmt.Fprint(w, "response to profile")
	// //**********************
	// db.Exec(`UPDATE users SET "firstName"=?, "lastName"=?, "company"=?, "username"=?,"password"=?,"email"=? WHERE "ID"=?`, firstName, lastName, company, username, hash, email, id)
	fmt.Println(firstName, lastName, company, username, hash, email, id)
	http.Redirect(w, r, "/", 302)
}

func loginGetHandler(w http.ResponseWriter, r *http.Request) {
	p := TemplatePage{Title: "login", Data: ""}
	t, _ := template.ParseFiles("templates/login.html")
	t.Execute(w, p)
}
func loginPostHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	username := r.PostForm.Get("username")
	password := r.PostForm.Get("password")
	//get the stored hash for that user from the database converted the baytes
	db, _ := sql.Open("sqlite3", "./users.db")
	rows, _ := db.Query(`
	SELECT password,ID FROM users WHERE username = ?
	`, username)
	rows.Next()
	var hash string
	var id int
	rows.Scan(&hash, &id)
	rows.Close()
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		http.Redirect(w, r, "/login", 302)
		return
	}
	session, _ := store.Get(r, "session")
	session.Values["username"] = username
	session.Values["id"] = id
	session.Save(r, w)
	http.Redirect(w, r, "/", 302)
}

func registerGetHandler(w http.ResponseWriter, r *http.Request) {
	p := TemplatePage{UserName: "register"}
	t, _ := template.ParseFiles("templates/register.html")
	t.Execute(w, p)
}
func registerPostHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	username := r.PostForm.Get("username")
	password := r.PostForm.Get("password")
	email := r.PostForm.Get("email")
	cost := bcrypt.DefaultCost
	hash, err := bcrypt.GenerateFromPassword([]byte(password), cost)
	if err != nil {
		return
	}
	//add username + hash + email to the data base
	db, _ := sql.Open("sqlite3", "./users.db")
	stmt, _ := db.Prepare(`
	INSERT INTO users (username,password,email) VALUES (?,?,?)
	`)
	stmt.Exec(username, hash, email)
	stmt.Close()
	http.Redirect(w, r, "/login", 302)
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session")
	userNameInterface, null := session.Values["username"]
	if !null {
		http.Redirect(w, r, "/login", 302)
		return
	}
	userName := fmt.Sprintf("%v", userNameInterface)

	r.ParseMultipartForm(10 << 20)
	file, handler, err := r.FormFile("avatar")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err)
		return
	}
	defer file.Close()
	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Println(err)
	}
	err = ioutil.WriteFile("static/avatars/"+userName+".png", fileBytes, 0644)
	if err != nil {
		log.Fatal(err)
	}
	// fmt.Fprintf(w, "Successfully Uploaded File\n")
	http.Redirect(w, r, "/profile", 302)

}

func swHandler(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session")
	userNameInterface, null := session.Values["username"]
	if !null {
		http.Redirect(w, r, "/login", 302)
		return
	}
	userName := fmt.Sprintf("%v", userNameInterface)
	p := TemplatePage{UserName: userName}
	w.Header().Set("content-type", "text/javascript")
	t, _ := template.ParseFiles("templates/sw.js")
	t.Execute(w, p)
}
func appCacheHandler(w http.ResponseWriter, r *http.Request) {
	p := TemplatePage{}
	w.Header().Set("content-type", "text/cache-manifest")
	t, _ := template.ParseFiles("templates/manifest.appcache")
	t.Execute(w, p)
}

func dbHandler(w http.ResponseWriter, r *http.Request) {
	p := TemplatePage{}
	w.Header().Set("content-type", "text/javascript")
	t, _ := template.ParseFiles("templates/db.js")
	t.Execute(w, p)
}

func ajaxHandler(w http.ResponseWriter, r *http.Request) {
	// p := TemplatePage{}
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	//**********************

	fmt.Println("Ajaxhandler()")
	decoder := json.NewDecoder(r.Body)

	var data JsonMsg
	err := decoder.Decode(&data)
	if err != nil {
		fmt.Println("jeson decoding error")
		return
	}

	//apdate sqlite values with this ones

	fmt.Println("fn:", data.FirstName, "ln:", data.LastName, "comp:", data.Company, "eml:", data.Email, "un:", data.UserName)
	fmt.Fprint(w, "response to ajax")
	//**********************
	// t, _ := template.ParseFiles("templates/db.js")
	// t.Execute(w, p)
}

func main() {

	db, _ := sql.Open("sqlite3", "./users.db")
	stmt, _ := db.Prepare(`
	CREATE TABLE IF NOT EXISTS "users" (
		"ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
		"username"	TEXT NOT NULL UNIQUE,
		"password"	TEXT NOT NULL,
		"email"	TEXT,
		"firstName"	TEXT,
		"lastName"	TEXT,
		"company"	TEXT,
		"avatar"	BLOB
	);
	`)
	stmt.Exec()
	stmt.Close()

	r := mux.NewRouter()
	r.HandleFunc("/", indexHandler)

	r.HandleFunc("/login", loginGetHandler).Methods("GET")
	r.HandleFunc("/login", loginPostHandler).Methods("POST")

	r.HandleFunc("/register", registerGetHandler).Methods("GET")
	r.HandleFunc("/register", registerPostHandler).Methods("POST")

	r.HandleFunc("/profile", profileGetHandler).Methods("GET")
	r.HandleFunc("/profile", profilePostHandler).Methods("POST")

	r.HandleFunc("/upload", uploadHandler)

	r.HandleFunc("/sw.js", swHandler)

	r.HandleFunc("/manifest.appcache", appCacheHandler)

	r.HandleFunc("/db.js", dbHandler)

	r.HandleFunc("/ajax", ajaxHandler)

	fs := http.FileServer(http.Dir("./static/"))
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", fs))
	http.Handle("/", r)
	http.ListenAndServe(":8000", nil)

}
