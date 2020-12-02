const express = require('express');
const Joi = require('joi');
const app = express();
const fs = require('fs');
const dljs = require("damerau-levenshtein-js");
var admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://se3316-ceveres4-lab5.firebaseio.com"
  });

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
    
})

let rawdata = fs.readFileSync('Lab3-timetable-data.json');
let timetable = JSON.parse(rawdata);

app.use(express.json());

let rawschedules = fs.readFileSync('schedules.json')
let schedules = JSON.parse(rawschedules);

let rawreviews = fs.readFileSync('reviews.json')
let reviews = JSON.parse(rawreviews);

function updateSchedules(){
    fs.writeFile('schedules.json', JSON.stringify(schedules), function (err) {
        if (err) throw err;
      });
}

function updateReviews(){
    fs.writeFile('reviews.json', JSON.stringify(reviews), function (err) {
        if (err) throw err;
      });
}

app.get('/', (req,res) =>{
    res.send('hello world!')
});

app.get('/api/subjectCodes', (req,res) =>{
    var json = {};
    var subjectCodes = []
    json.subjectCodes = subjectCodes;
    
    for (i=0;i<timetable.length;i++){
        var classNumber = timetable[i].catalog_nbr;
        var className = timetable[i].className;
        var subject = timetable[i].subject;
        var courseCode = timetable[i].course_info[0].class_nbr;
        var classs = {
          "classNumber": classNumber,
          "className": className,
          "subject": subject,
          "courseCode": courseCode
        }
        json.subjectCodes.push(classs);
    }
    res.send(json);
});

app.get('/api/subjectCodes/:subjectCode', (req,res) =>{
    const {error} = validateTimetable({ 
        subjectCode: req.params.subjectCode
        });
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    var json = {};
    var subjectCodes = []
    json.subjectCodes = subjectCodes;
    var subjectCode = req.params.subjectCode;
    
    for (i=0;i<timetable.length;i++){
        var classNumber = timetable[i].catalog_nbr;
        var className = timetable[i].className;
        var subject = timetable[i].subject;
        var courseCode = timetable[i].course_info[0].class_nbr;
        if(subjectCode.localeCompare(subject) == 0){
            var classs = {
            "classNumber": classNumber,
            "className": className,
            "subject": subject,
            "courseCode": courseCode
            }
            json.subjectCodes.push(classs);
        }
    }
    if(json.subjectCodes.length == 0){
        res.status(404).send("The course with the given subject code was not found");
    }else{
        res.send(json);
    }
});

app.get('/api/timetable/:subjectCode', (req,res) =>{
    const {error} = validateTimetable({ 
        subjectCode: req.params.subjectCode
        });
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    var json = {};
    var subjectCodes = []
    json.subjectCodes = subjectCodes;
    var subjectCode = req.params.subjectCode;
    
    for (i=0;i<timetable.length;i++){
        var classNumber = timetable[i].catalog_nbr;
        var className = timetable[i].className;
        var subject = timetable[i].subject;
        if(subjectCode.localeCompare(subject) == 0){
            var classs = {
                "classNumber": classNumber,
                "className": className,
                "subject": subject,
                "courseInfo": []
            }
        
            for(j=0;j<timetable[i].course_info.length;j++){
                var courseComponent = timetable[i].course_info[j].ssr_component;
                var courseCode = timetable[i].course_info[j].class_nbr;
                var startTime = timetable[i].course_info[j].start_time;
                var endTime = timetable[i].course_info[j].end_time;
                var days = timetable[i].course_info[j].days;

                var course_info = {
                    "courseCode": courseCode,
                    "component": courseComponent,
                    "startTime": startTime,
                    "endTime": endTime,
                    "days": days
                }
                classs.courseInfo.push(course_info);
            }
            json.subjectCodes.push(classs);
        }
    }
    if(json.subjectCodes.length == 0){
        res.status(404).send("The course with the given subject code or course code was not found");
    }else{
        res.send(json);
    }
});

app.get('/api/keyword/:keyword', (req,res) =>{
    var json = {};
    var subjectCodes = []
    json.subjectCodes = subjectCodes;
    var keyword = req.params.keyword;
    
    for (i=0;i<timetable.length;i++){
        var classNumber = timetable[i].catalog_nbr;
        var className = timetable[i].className;
        str = className.replace(/\s+/g, '');
        var subject = timetable[i].subject;
        var classNameDistance = dljs.distance(keyword, str);
        var classNumberDistance = dljs.distance(keyword, classNumber);
        if((classNameDistance <= 2 && classNameDistance >= 0) || (classNumberDistance <= 2 && classNumberDistance >= 0)){
            var classs = {
                "classNumber": classNumber,
                "className": className,
                "subject": subject,
                "courseInfo": []
            }
        
            for(j=0;j<timetable[i].course_info.length;j++){
                var courseComponent = timetable[i].course_info[j].ssr_component;
                var courseCode = timetable[i].course_info[j].class_nbr;
                var startTime = timetable[i].course_info[j].start_time;
                var endTime = timetable[i].course_info[j].end_time;
                var days = timetable[i].course_info[j].days;

                var course_info = {
                    "courseCode": courseCode,
                    "component": courseComponent,
                    "startTime": startTime,
                    "endTime": endTime,
                    "days": days
                }
                classs.courseInfo.push(course_info);
            }
            json.subjectCodes.push(classs);
        }
    }
    if(json.subjectCodes.length == 0){
        res.status(404).send("The course with the given subject code or course code was not found");
    }else{
        res.send(json);
    }
});

app.get('/api/timetable/:subjectCode/:courseCode', (req,res) =>{
    const {error} = validateTimetable({ 
        subjectCode: req.params.subjectCode,
        courseCode: req.params.courseCode
        });
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    var json = {};
    var subjectCodes = []
    json.subjectCodes = subjectCodes;
    var subjectCode = req.params.subjectCode;
    var courseCodeSent = req.params.courseCode;
    
    for (i=0;i<timetable.length;i++){
        var classNumber = timetable[i].catalog_nbr;
        var className = timetable[i].className;
        var subject = timetable[i].subject;
        var classs = {
            "classNumber": classNumber,
            "className": className,
            "subject": subject,
            "courseInfo": []
        }
        var courseCode;

        for(j=0;j<timetable[i].course_info.length;j++){
            var courseComponent = timetable[i].course_info[j].ssr_component;
            courseCode = timetable[i].course_info[j].class_nbr;
            var startTime = timetable[i].course_info[j].start_time;
            var endTime = timetable[i].course_info[j].end_time;
            var days = timetable[i].course_info[j].days;

            if(subjectCode.localeCompare(subject) == 0 && courseCodeSent.localeCompare(courseCode) == 0){
                var course_info = {
                    "courseCode": courseCode,
                    "component": courseComponent,
                    "startTime": startTime,
                    "endTime": endTime,
                    "days": days
                }
                classs.courseInfo.push(course_info);
            }
        }
        if(subjectCode.localeCompare(subject) == 0 && courseCodeSent.localeCompare(courseCode) == 0){
            json.subjectCodes.push(classs);
        }
    }
    if(json.subjectCodes.length == 0){
        res.status(404).send("The course with the given subject code or course code was not found");
    }else{
        res.send(json);
    }
});

app.get('/api/timetable/:subjectCode/:courseCode/:component', (req,res) =>{
    const {error} = validateTimetable({ 
        subjectCode: req.params.subjectCode,
        courseCode: req.params.courseCode,
        component: req.params.component
        });
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    var json = {};
    var subjectCodes = []
    json.subjectCodes = subjectCodes;
    var subjectCode = req.params.subjectCode;
    var courseCodeSent = req.params.courseCode;
    var component = req.params.component;
    
    for (i=0;i<timetable.length;i++){
        var classNumber = timetable[i].catalog_nbr;
        var className = timetable[i].className;
        var subject = timetable[i].subject;
        var classs = {
            "classNumber": classNumber,
            "className": className,
            "subject": subject,
            "courseInfo": []
        }
        var courseCode;

        for(j=0;j<timetable[i].course_info.length;j++){
            var courseComponent = timetable[i].course_info[j].ssr_component;
            courseCode = timetable[i].course_info[j].class_nbr;
            var startTime = timetable[i].course_info[j].start_time;
            var endTime = timetable[i].course_info[j].end_time;
            var days = timetable[i].course_info[j].days;

            if(subjectCode.localeCompare(subject) == 0 && courseCodeSent.localeCompare(courseCode) == 0){
                var course_info = {
                    "courseCode": courseCode,
                    "component": courseComponent,
                    "startTime": startTime,
                    "endTime": endTime,
                    "days": days
                }
                classs.courseInfo.push(course_info);
            }
        }
        if(subjectCode.localeCompare(subject) == 0 && courseCodeSent.localeCompare(courseCode) == 0){
            json.subjectCodes.push(classs);
        }
    }
    if(json.subjectCodes.length == 0){
        res.status(404).send("The course with the given subject code or course code was not found");
    }else{

        for(i = 0;i<json.subjectCodes.length;i++){
            for(j=0;j<json.subjectCodes[i].courseInfo.length;j++){
                if(json.subjectCodes[i].courseInfo[j].component.localeCompare(component) != 0){
                    json.subjectCodes[i].courseInfo.splice(j,1);
                    
                }
            }
        }
        for(j=0;j<json.subjectCodes.length;j++){
            if(json.subjectCodes[j].courseInfo.length == 0){
                json.subjectCodes.splice(j,1);
            }
        }

        res.send(json);
    }
});

app.put('/api/newSchedule', (req,res) =>{
    var body = req.body;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    const {error} = validateScheduleName({ scheduleName: body.scheduleName });//result.error
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    const schedulesList = schedules.find(c => c.email.localeCompare(body.email) ==0);
    if(schedulesList){

        for(i=0;i<schedules.length;i++){
            if(schedules[i].email.localeCompare(body.email) ==0){
                const schedule = schedules[i].schedules.find(c => c.scheduleName.localeCompare(body.scheduleName) ==0);
                if(schedule) return res.status(400).send("The schedule with name "+body.scheduleName+" already exists");
                if(schedules[i].schedules.length <20){

                    var newSchedule = {
                        "scheduleName": body.scheduleName,
                        "status": "private",
                        "description":body.description,
                        "lastModified":dateTime,
                        "codes": []
                        }
                    schedules[i].schedules.push(newSchedule);
                    updateSchedules();
                    return res.send(schedules[i]);
                }
                else{
                    res.status(400).send("Maximum number of schedules reached");
                }
            }
        }
        
    }
    else{
        
        var newSchedule = {
        "email": body.email,
        "username": body.username,
        "schedules": [
            {
                "scheduleName": body.scheduleName,
                "status": "private",
                "description":body.description,
                "lastModified":dateTime,
                "codes": []
            }
        ]}
        schedules.push(newSchedule);
        updateSchedules();
        res.send(newSchedule);
    }
});

app.put('/api/updateSchedule', (req,res) =>{
    var body = req.body;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    const {error} = validateScheduleName({ scheduleName: body.scheduleName });//result.error
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    var x,y;
    for(i=0;i<schedules.length;i++){
        if(schedules[i].email.localeCompare(body.email) ==0){
            for(j=0;j<schedules[i].schedules.length;j++){
                if(schedules[i].schedules[j].scheduleName.localeCompare(body.scheduleName) ==0){
                    x = i;
                    y = j;
                    schedules[i].schedules[j].codes = [];
                    for(k=0;k<body.codes.length;k++){
                        const {error} = validateTimetable({ 
                            subjectCode: body.codes[k].subjectCode,
                            courseCode: body.codes[k].courseCode
                            });
                        if(error){
                            res.status(400).send(error.details[0].message);
                            return;
                        }
                        schedules[i].schedules[j].lastModified = dateTime
                        schedules[i].schedules[j].codes.push(body.codes[k]);
                    }
                }
            }
        }
    }
    updateSchedules();
    return res.send(schedules[x].schedules[y]);
});

app.delete('/api/deleteSchedule/:email/:scheduleName', (req,res) =>{
    var scheduleName =  req.params.scheduleName;
    var email = req.params.email;
    const {error} = validateScheduleName({ scheduleName: scheduleName });//result.error
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    for(i=0;i<schedules.length;i++){
        if(schedules[i].email.localeCompare(email) ==0){
            const schedule = schedules[i].schedules.find(c => c.scheduleName.localeCompare(scheduleName) ==0);
            if(!schedule) return res.status(400).send("The schedule with name "+scheduleName+" does not exist");

            const index = schedules[i].schedules.indexOf(schedule);
            schedules[i].schedules.splice(index,1);
        
            updateSchedules();
            res.send(schedule);

        }
    }

});

app.delete('/api/deleteAllSchedules/:email', (req,res) =>{
    var email = req.params.email;
    for(i=0;i<schedules.length;i++){
        if(schedules[i].email.localeCompare(email) ==0){
            
            schedules[i].schedules = [];
            updateSchedules();
            res.send(schedules[i]);

        }
    }
});

app.put('/api/specificSchedule', (req,res) =>{
    var body = req.body;
    const {error} = validateScheduleName({ scheduleName: body.scheduleName });//result.error
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    for(i=0;i<schedules.length;i++){
        if(schedules[i].email.localeCompare(body.email) ==0){
            const schedule = schedules[i].schedules.find(c => c.scheduleName.localeCompare(body.scheduleName) ==0);
            if(!schedule) return res.status(404).send("The schedule with name "+body.scheduleName+" does not exist");
            return res.send(schedule);

        }
    }
});

app.put('/api/allSchedules', (req,res) =>{
    var body = req.body;
    var newSchedule = []

    for(i=0;i<schedules.length;i++){
        if(schedules[i].email.localeCompare(body.email) ==0){
            for(j=0;j<schedules[i].schedules.length;j++){
                var name = schedules[i].schedules[j].scheduleName;
                var length = schedules[i].schedules[j].codes.length;
                newSchedule.push(name + ": " + length);
            }

        }
    }

    res.send(newSchedule);
});

app.put('/api/updateScheduleStatus', (req,res) =>{
    var body = req.body;
    console.log(body)
    const {error} = validateScheduleName({ scheduleName: body.scheduleName });//result.error
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    for(i=0;i<schedules.length;i++){
        if(schedules[i].email.localeCompare(body.email) ==0){
            for(j=0;j<schedules[i].schedules.length;j++){
                if(schedules[i].schedules[j].scheduleName.localeCompare(body.scheduleName) ==0){
                    var status = schedules[i].schedules[j].status;
                    if(status.localeCompare("private")==0){
                        schedules[i].schedules[j].status = "public";
                    }
                    else{
                        schedules[i].schedules[j].status = "private";
                    }
                    return res.send(schedules[i]);
                }
            }


        }
    }
});

app.get('/api/allPublicSchedules', (req,res) =>{
    var allPublicSchedules = [];
    for(i=0;i<schedules.length;i++){
        for(j=0;j<schedules[i].schedules.length;j++){
            var currentSchedule = schedules[i].schedules[j];
            var status = currentSchedule.status;
            if(status.localeCompare("public")==0){
                var newSchedule = {
                    "username": schedules[i].username,
                    "scheduleName": currentSchedule.scheduleName,
                    "lastModified": currentSchedule.lastModified,
                    "description": currentSchedule.description,
                    "codes": currentSchedule.codes   
                }
                allPublicSchedules.push(newSchedule);
                allPublicSchedules.sort(function(a, b){return Date.parse(b.lastModified)-Date.parse(a.lastModified)});
            }
        }

    }
    return res.send(allPublicSchedules);
});


app.get('/api/allSchedulesAsList', (req,res) =>{
    res.send(schedules);
});


app.put('/api/newReview', (req,res) =>{
    var body = req.body;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    
    const schedulesList = schedules.find(c => c.email.localeCompare(body.email) ==0);
    if(schedulesList){

        for(i=0;i<schedules.length;i++){
            if(schedules[i].email.localeCompare(body.email) ==0){
                const schedule = schedules[i].schedules.find(c => c.scheduleName.localeCompare(body.scheduleName) ==0);
                if(schedule) return res.status(400).send("The schedule with name "+body.scheduleName+" already exists");
                if(schedules[i].schedules.length <20){

                    var newSchedule = {
                        "scheduleName": body.scheduleName,
                        "status": "private",
                        "description":body.description,
                        "lastModified":dateTime,
                        "codes": []
                        }
                    schedules[i].schedules.push(newSchedule);
                    updateSchedules();
                    return res.send(schedules[i]);
                }
                else{
                    res.status(400).send("Maximum number of schedules reached");
                }
            }
        }
        
    }
    else{
        
        var newReview = {
        "username": body.username,
        "dateCreated":dateTime,
        "courseID":body.courseID,
        "review": body.review
        }
        reviews.push(newReview);
        updateReviews();
        res.send(newReview);
    }
});

function validateScheduleName(course){
    const schema = Joi.object({
        scheduleName: Joi.string()
            .min(3)
            .max(20)
    });
    return schema.validate(course);
}
function validateTimetable(timetable){
    const schema = Joi.object({ 
        subjectCode: Joi.string()
        .alphanum()
        .min(3)
        .max(20),
        courseCode: Joi.number()
        .integer(),
        component: Joi.string()
        .pattern(new RegExp('^[A-Z]{3}$'))
        .min(3)
        .max(3)
    });
    return schema.validate(timetable);
}

//PORT
const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Listening on port '+port));