const http = require("http");
const url = require("url");
const fs = require('fs');
const { log } = require("console");
let studentdata = fs.readFileSync('students.json', 'utf-8') ? JSON.parse(fs.readFileSync('students.json', 'utf-8')) : [];

// ID FOR NEW student 
let Newid = 1;
if (studentdata.length > 0) {
    Newid = studentdata[studentdata.length - 1].id + 1;
}


http.createServer((req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    let parsedURL = url.parse(req.url, true)

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        return res.end();
    }
    // GET SINGLE student 
    else if (parsedURL.query.id && parsedURL.pathname === "/getstudents" && req.method === "GET") {
        let singlestudent = studentdata.find((student, index) => {
            return Number(parsedURL.query.id) === Number(student.id)
        })
        if (singlestudent) {
            res.write(JSON.stringify({
                message: singlestudent
            }));
            res.end()
        } else {
            res.write(JSON.stringify({
                message: "Searched student Not Found",
                status: 401,
            }));
            res.end()
        }
    }
    // DELETE student 
    else if (parsedURL.query.id && parsedURL.pathname === "/deletestudent" && req.method === "DELETE") {
        let dltstudentindex = studentdata.findIndex((student, index) => {
            return Number(parsedURL.query.id) === Number(student.id)
        })
        if (dltstudentindex !== -1) {
            studentdata.splice(dltstudentindex, 1);
            fs.writeFileSync('students.json', JSON.stringify(studentdata))

            res.write(JSON.stringify({
                message: 'student Deleted Successfully',
                status: 200
            }));
            res.end();
        } else if (dltstudentindex === -1) {
            res.write(JSON.stringify({
                message: "Deleting student Not Found",
                status: 401,
            }));
            res.end()
        }
    }
    // CREATE student 
    else if (parsedURL.pathname === "/createstudent" && req.method === "POST") {
        let newstudentData = "";
        let newstudent;
        req.on("data", (chunk) => {
            newstudentData += chunk;
        })
        req.on("end", () => {
            newstudent = JSON.parse(newstudentData)
            newstudent.id = Newid;
            studentdata.push(newstudent);
            fs.writeFileSync('students.json', JSON.stringify(studentdata));
        })
        res.write(JSON.stringify({
            message: "new student created",
            status: true
        }))
        res.end()
    }
    // EDIT student 
    else if (parsedURL.pathname === '/editstudent' && req.method === 'PUT') {
        let studentEditData = ""
        req.on('data', (chunk) => {
            studentEditData += chunk;
        })
        req.on('end', () => {
            let studentEditDataParsed = JSON.parse(studentEditData)
            let indexofeditstudent = studentdata.findIndex((ele) => {
                return Number(ele.id) == Number(studentEditDataParsed.id)
            })
            if (indexofeditstudent !== -1) {
                studentdata[indexofeditstudent] = studentEditDataParsed;
                fs.writeFileSync('students.json', JSON.stringify(studentdata))
                res.write(JSON.stringify({
                    message: "student edited successfully",
                    status: true
                }))
                res.end()
            } else {
                res.write(JSON.stringify({
                    message: "Invalid student or student not found",
                    status: false
                }))
                res.end()
            }
        })
    }
    // GET ALL studentS 
    else if (!parsedURL.query.id && parsedURL.pathname === "/getstudents" && req.method === "GET") {
        res.write(JSON.stringify({
            message: studentdata,
            status: 200
        }));
        res.end()
    }
    else {
        res.write(JSON.stringify({
            message: "server error",
            status: 404
        }))
    }


})
    .listen(8000, () => {
        console.log("its up...")
    })