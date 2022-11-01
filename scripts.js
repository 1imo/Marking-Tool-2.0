// const indexedDB = window.indexedDB;

// const request = indexedDB.open("studentData", 1);

// request.onerror = function (event) {
//     console.log("ERROR");
//     console.log(event);
// }

// request.onupgradeneeded = function () {
//     const db = request.result;
//     const store = db.createObjectStore("data", { keypath: "id" });
//     store.createIndex("", ["studentName"], { unique: false });
//     store.createIndex("studentName_and_data", ["studentName", ["marks", "perc", "grade"]], { unique: false });
// }

// request.onsuccess = function () {
//     const db = request.result;
//     const transaction = db.transaction("data", "readwrite");

//     const store = transaction.objectStore("results");
//     const studentNameIndex = store.index("student_name");
//     const studentMarksIndex = store.index("student_marks");
//     const studentPercIndex = store.index("student_perc");
//     const studentGradeIndex = store.index("student_grade");

//     setInterval(() => {
//         store.put()
//     }, 2000)


//     transaction.oncomplete = function () {
//         db.close
//     }
// }

const hidden = document.querySelector(".hidden");
const modal = document.querySelector(".modal");
const submitParamsButton = document.querySelector(".submitParams");

let modalEngaged = false;

let numberOfGrades = 0

let data = []

let grades = []
let gradeLowerBounds = []

const download = (content, filename, contentType) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType })
    
    a.href = URL.createObjectURL(file)
    a.download = filename
    a.click()

    URL.revokeObjectURL(a.href)
}

document.querySelector(".submitEntry").addEventListener("click", () => {
    let name = document.querySelector(".studentName").value
    let marks = document.querySelector(".marksReceived").value
    let totalMarks = document.querySelector(".totalMarksAv").value
    let perc = marks * 100 / totalMarks

    let grade = 0;

    for (let i = 0; i < grades.length; i++) {
        if (perc >= gradeLowerBounds[i][0]) {
            grade = grades[i][0]
            break;
        }
        
    }
    console.log(grade);

    let entry = [name, marks, perc + "%", grade]


    data.push(entry)

    document.querySelector(".studentName").value = ""
    document.querySelector(".marksReceived").value = ""
    
})

document.querySelector(".exportFile").addEventListener("click", () => {

    const rows = data;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    rows.forEach((rowArray) => {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);

})

menuPopup = () => {
    if (!modalEngaged) {
        modal.classList.remove("hidden")
        modalEngaged = true
    } else {
        modal.classList.add("hidden")
        modalEngaged = false
    }
    
}

submitParamsButton.addEventListener("click", () => {
    if (+document.querySelector(".gradeCount").value > 0) {
        let gradeInputs = new DocumentFragment()
        numberOfGrades = +document.querySelector(".gradeCount").value
        
        for (let i = 0; i < numberOfGrades; i++) {
            let container = document.createElement("div")
            container.classList.add("container")
            let gradeInput = document.createElement("input")
            gradeInput.classList.add("gradeName")
            gradeInput.placeholder = "Grade"
            let gradeBoundary = document.createElement("input")
            gradeBoundary.classList.add("gradeLBound")
            gradeBoundary.placeholder = "Lower Grade Bound"
            container.append(gradeInput, gradeBoundary)
            gradeInputs.append(container)
            document.querySelector(".gradeBounds").append(gradeInputs)
        }


        document.querySelector(".gradeBounds").classList.remove("hidden")

    }
})

document.querySelector(".submitGradeParams").addEventListener("click", () => {
    let vals = document.querySelectorAll(".container > input")

    let ordVal = 0
    
    vals.forEach((node) => {
        ordVal+=1
        if (node.value) {
            if (ordVal % 2 == 0) {
                if (node.value.includes("%")) {
                    node.value.replace("%", "")
                }
                if (+node.value) {
                    gradeLowerBounds.push([+node.value, ordVal - 1])
                } else {
                    // Focus on rogue input
                }

            } else {
                grades.push([node.value, ordVal - 1])
            }
        }
    })

    let numOfSwaps = 0
    const bubbleSort = () => {
        for (let i = 0; i < gradeLowerBounds.length; i++) {
            if (i != gradeLowerBounds - 1) {
                if (gradeLowerBounds[i][0] > gradeLowerBounds[i + 1][0]) {
                    let temp = gradeLowerBounds[i]
                    gradeLowerBounds[i] = gradeLowerBounds[i + 1]
                    gradeLowerBounds[i + 1] = temp
                    numOfSwaps+=1
                }
            }

            if (numOfSwaps > 0) {
                numOfSwaps = 0
                bubbleSort()
            }

        }
    }

    const bubbleSortGradeNames = () => {
        
        for (let i = 0; i < grades.length; i++) {
            for (let x = 0; x < gradeLowerBounds.length; x++) {
                
                if (grades[i][1] == gradeLowerBounds[x][1]) {
                    let temp = grades[x]
                    grades[x] = grades[i]
                    grades[i] = temp
                }
                
    
                
    
            }
        }

        for (let i = 0; i < grades.length; i++) {
            let tempGradePos = grades[i].shift()
            let tempBoundPos = gradeLowerBounds[i].shift()
        }
    }
})