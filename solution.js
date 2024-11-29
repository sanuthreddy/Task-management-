import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;
let posts = [
];
let id=posts.length;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "country_capitals",
  password: "Srinivas@3948",
  port: 5432,
});
db.connect();
app.get("/", (req, res) => {
  res.redirect("/secrets");
});
app.get("/login", (req, res) => {
    res.render("secrets.ejs")
});
app.post("/api/posts/:id", async (req, res) => {
  try {
    await db.query("UPDATE dup_users_posts2 SET title=$1,contents=$2,status=$3 WHERE  id=$4",[req.body.title,req.body.contents,req.body.status,req.params.id]);
    res.redirect("/secrets");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating post" });
  }
});
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM dup_users_posts2 WHERE  id=$1",[req.params.id]);
    res.redirect("/secrets");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating post" });
  }
});
app.get("/edit/:id", async (req, res) => {
  try {
    const response = await db.query("Select id,title,contents,status from dup_users_posts2 where id=$1 ",[req.params.id]);
    console.log(response.rows);
    res.render("new.ejs", {
      heading: "Edit Task",
      submit: "Update Task",
      post: response.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});
app.post("/new/posts",async(req,res)=>
{
     await db.query("Insert into dup_users_posts2(title,contents,postdate,status) VALUES($1,$2,$3,$4)",[req.body.title,req.body.content,new Date(),req.body.status])
    res.redirect("/secrets");
})
app.get("/register", (req, res) => {
  res.redirect("/secrets");
});
app.get("/new",(req,res)=>
{
      res.render("new.ejs", { heading: "New Task", submit: "Create Task" });
})
app.get("/filter/:status", async(req, res) => {
    posts = [
    ];
    const esult=await db.query("Select id,title,contents,postdate,status from dup_users_posts2 where status=$1 ORDER BY postdate DESC",[req.params.status]);
    console.log(esult.rows);
    for (let i = 0; i < esult.rows.length; i++) 
      {
      const post={
        id:esult.rows[i].id,
        title:esult.rows[i].title,
        content:esult.rows[i].contents,
        status:esult.rows[i].status,
        date:esult.rows[i].postdate,
      }
      posts.push(post);
    }
    res.render("secrets.ejs",{posts:posts})
});
app.get("/secrets", async(req, res) => {
    posts = [
    ];
    const esult=await db.query("Select id,title,contents,postdate,status from dup_users_posts2  ORDER BY postdate DESC");
    console.log(esult.rows);
    for (let i = 0; i < esult.rows.length; i++) 
      {
      const post={
        id:esult.rows[i].id,
        title:esult.rows[i].title,
        content:esult.rows[i].contents,
        status:esult.rows[i].status,
        date:esult.rows[i].postdate,
      }
      posts.push(post);
    }
    res.render("secrets.ejs",{posts:posts})
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});