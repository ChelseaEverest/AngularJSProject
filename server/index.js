const express = require('express');
const Joi = require('joi');
const app = express();
const fs = require('fs');
const dljs = require("damerau-levenshtein-js");

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

function updateSchedules(){
    fs.writeFile('schedules.json', JSON.stringify(schedules), function (err) {
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

app.put('/api/newSchedule/:scheduleName', (req,res) =>{
    const {error} = validateScheduleName({ scheduleName: req.params.scheduleName });//result.error
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    const schedule = schedules.find(c => c.scheduleName.localeCompare(req.params.scheduleName) ==0);
    if(schedule) return res.status(400).send("The schedule with name "+req.params.scheduleName+" already exists");
    else{
        var newSchedule = {
        "scheduleName": req.params.scheduleName,
        "codes": []
        }
        schedules.push(newSchedule);
        updateSchedules();
        res.send(newSchedule);
    }
});

app.put('/api/updateSchedule/:scheduleName', (req,res) =>{
    const {error} = validateScheduleName({ scheduleName: req.params.scheduleName });//result.error
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    const schedule = schedules.find(c => c.scheduleName.localeCompare(req.params.scheduleName) ==0);
    if(!schedule) return res.status(404).send("The schedule with name "+req.params.scheduleName+" does not exist");
    else{
        for(i=0;i<schedules.length;i++){
            if(schedules[i].scheduleName.localeCompare(req.params.scheduleName) ==0){
                var body = req.body;
                schedules[i].codes = [];
                for(j=0;j<body.length;j++){
                    const {error} = validateTimetable({ 
                        subjectCode: body[j].subjectCode,
                        courseCode: body[j].courseCode
                        });
                    if(error){
                        res.status(400).send(error.details[0].message);
                        return;
                    }
                    schedules[i].codes.push(body[j]);
                }
                updateSchedules();
                return res.send(schedules[i]);
            }
        }
    }
});

app.delete('/api/deleteSchedule/:scheduleName', (req,res) =>{
    const {error} = validateScheduleName({ scheduleName: req.params.scheduleName });//result.error
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    const schedule = schedules.find(c => c.scheduleName.localeCompare(req.params.scheduleName) ==0);
    if(!schedule) return res.status(404).send("The schedule with name "+req.params.scheduleName+" does not exist");

    const index = schedules.indexOf(schedule);
    schedules.splice(index,1);

    updateSchedules();
    res.send(schedule);
});

app.delete('/api/deleteAllSchedules', (req,res) =>{
    schedules = [];

    updateSchedules();
    res.send(schedules);
});

app.get('/api/specificSchedule/:scheduleName', (req,res) =>{
    const {error} = validateScheduleName({ scheduleName: req.params.scheduleName });//result.error
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    const schedule = schedules.find(c => c.scheduleName.localeCompare(req.params.scheduleName) ==0);
    if(!schedule) return res.status(404).send("The schedule with name "+req.params.scheduleName+" does not exist");
    return res.send(schedule);
});

app.get('/api/allSchedules', (req,res) =>{
    var newSchedule = []
    for(i=0;i<schedules.length;i++){
        var name = schedules[i].scheduleName;
        var length = schedules[i].codes.length;
        newSchedule.push(name + ": " + length);
    }

    res.send(newSchedule);
});

app.get('/api/allSchedulesAsList', (req,res) =>{
    res.send(schedules);
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