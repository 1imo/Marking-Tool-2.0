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

let calculateModeBool = false;
let totalMarksValue = 0;
let totalQuestionsValue = 0;

let questionCounter = 0;
let marksCounter = 0;


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
    let perc;
    

    let grade = 0;

    // console.log(calculateModeBool)
    // console.log(totalMarksValue)
    // console.log(totalQuestionsValue)
    // console.log(questionCounter)
    console.log(grades)

    

    

     if (calculateModeBool) {
        if (+marks || marks == "0") {
            console.log("RUNNING")
            if (marks == "0") {
                marksCounter+=0
            } else {
                marksCounter+=+marks
            }
            questionCounter+=1
        }
        
        
    }
    if (calculateModeBool && questionCounter == totalQuestionsValue) {
        perc = marksCounter * 100 / totalMarksValue
        let entry;
        if (grades.length >= 1) {
            entry = [name, marksCounter, perc + "%", getGrade(perc)]
        } else {
            entry = [name, marksCounter, perc + "%"]
        }
        data.push(entry)
        
        document.querySelector(".studentName").value = ""
        marksCounter = 0
        questionCounter = 0
    }

    if (!calculateModeBool) {
        if (+marks || marks == "0") {
            let receivedMarks;

            if (+marks) {
                receivedMarks = +marks
            } else {
                receivedMarks = 0
            }
        
            perc = receivedMarks * 100 / totalMarks
            let entry;
            if (grades.length >= 1) {
                entry = [name, receivedMarks, perc + "%", getGrade(perc)]
            } else {
                entry = [name, receivedMarks, perc + "%"]
            }
            data.push(entry)
        
            document.querySelector(".studentName").value = ""
        }
    }
        
    document.querySelector(".marksReceived").value = ""
    
})

getGrade = (percen) => {
    for (let i = 0; i < grades.length; i++) {
        if (percen >= gradeLowerBounds[i][0]) {
            grade = grades[i][0]
            break;
        }
        
    }
}

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

let menuElement = document.createElement("div");
menuElement.classList.add("menuPopup");
let submitBtnMenu = document.createElement("button");
submitBtnMenu.classList.add("submitMenuBtn");
submitBtnMenu.textContent = "Submit"
let menuSubmitBtn = document.querySelector(".submitMenuBtn");

let calculMode = false;

const calculateMode = () => {
    let header = document.createElement("p")
    let headerText = document.createTextNode("Calculate Mode");
    header.classList.add("menuLgHeader")
    header.appendChild(headerText)
    let container = document.createElement("div");
    container.classList.add("radioContainer")
    let text = document.createElement("p");
    let textNode = document.createTextNode("Enabled:")
    text.appendChild(textNode);
    let radioBtn = document.createElement("input")
    radioBtn.type = "checkbox"
    if (calculateModeBool) {
        radioBtn.checked = true
    }
    container.appendChild(text)
    container.appendChild(radioBtn)

    let calcModeBtn = document.querySelector(".calcMode");

    let rect = calcModeBtn.getBoundingClientRect();
    // console.log(rect.top, rect.right, rect.bottom, rect.left);

    const menuOpen = () => {
        // console.log(calculMode)
        if (calculMode == false) {
            menuElement.classList.remove("hidden")

            console.log(menuElement.children)
            menuElement.appendChild(header)
            menuElement.appendChild(container)
            menuElement.appendChild(submitBtnMenu)
            positionMenu(rect.bottom, rect.left)
            calculMode = true

        } else {
            let child = menuElement.firstElementChild;
            while (child) {
                menuElement.removeChild(child);
                child = menuElement.lastElementChild;
            }
            menuElement.classList.add("hidden")
            calculMode = false
        }
        
    }

    menuOpen()

    document.querySelector(".submitMenuBtn").addEventListener("click", () => {
        if (radioBtn.checked) {
            calculateModeBool = true
            // console.log(calculateModeBool)
            calculateMode()
        } else {
            calculateModeBool = false
            calculateMode()
        }
    })
    
}



totalMarksMode = () => {
    let header = document.createElement("p")
    let headerText = document.createTextNode("Total Marks");
    header.classList.add("menuLgHeader")
    header.appendChild(headerText)
    let radioBtn = document.createElement("input")
    radioBtn.placeholder = "Total Marks: "
    if (totalMarksValue > 0) {
        radioBtn.placeholder = totalMarksValue
    }

    let calcModeBtn = document.querySelector(".totalMarks");

    let rect = calcModeBtn.getBoundingClientRect();
    // console.log(rect.top, rect.right, rect.bottom, rect.left);

    const menuOpen = () => {
        // console.log(calculMode)
        if (calculMode == false) {
            menuElement.classList.remove("hidden")

            // console.log(menuElement.children)
            menuElement.appendChild(header)
            menuElement.appendChild(radioBtn)
            menuElement.appendChild(submitBtnMenu)
            positionMenu(rect.bottom, rect.left)
            calculMode = true

        } else {
            let child = menuElement.firstElementChild;
            while (child) {
                menuElement.removeChild(child);
                child = menuElement.lastElementChild;
            }
            menuElement.classList.add("hidden")
            calculMode = false
        }
        
    }

    menuOpen()
    
    document.querySelector(".submitMenuBtn").addEventListener("click", () => {
        if (+radioBtn.value) {
            totalMarksValue = +radioBtn.value
            // console.log(totalMarksValue)
            totalMarksMode()
        } else {
            totalMarksMode()
        }
    })
}





questionCountMode = () => {
    let header = document.createElement("p")
    let headerText = document.createTextNode("Question Count");
    header.classList.add("menuLgHeader")
    header.appendChild(headerText)
    let radioBtn = document.createElement("input")
    radioBtn.placeholder = "Question Count: "
    if (totalQuestionsValue > 0) {
        radioBtn.placeholder = totalQuestionsValue
    }

    let calcModeBtn = document.querySelector(".questCount");

    let rect = calcModeBtn.getBoundingClientRect();
    // console.log(rect.top, rect.right, rect.bottom, rect.left);

    const menuOpen = () => {
        // console.log(calculMode)
        if (calculMode == false) {
            menuElement.classList.remove("hidden")

            // console.log(menuElement.children)
            menuElement.appendChild(header)
            menuElement.appendChild(radioBtn)
            menuElement.appendChild(submitBtnMenu)
            positionMenu(rect.bottom, rect.left)
            calculMode = true

        } else {
            let child = menuElement.firstElementChild;
            while (child) {
                menuElement.removeChild(child);
                child = menuElement.lastElementChild;
            }
            menuElement.classList.add("hidden")
            calculMode = false
        }
        
    }

    menuOpen()

    document.querySelector(".submitMenuBtn").addEventListener("click", () => {
        if (+radioBtn.value) {
            totalQuestionsValue = +radioBtn.value
            questionCountMode()
        } else {
            questionCountMode()
        }
    })
}


gradeBoundariesMode = () => {
    let header = document.createElement("p")
    let headerText = document.createTextNode("Grade Boundaries");
    header.classList.add("menuLgHeader")
    header.appendChild(headerText)
    let radioBtn = document.createElement("input")
    radioBtn.placeholder = "Grade Boundaries: "

    let calcModeBtn = document.querySelector(".gradeBoundariesLg");

    let rect = calcModeBtn.getBoundingClientRect();
    // console.log(rect.top, rect.right, rect.bottom, rect.left);

    const menuOpen = () => {
        // console.log(calculMode)
        if (calculMode == false) {
            menuElement.classList.remove("hidden")

            // console.log(menuElement.children)
            menuElement.appendChild(header)
            menuElement.appendChild(radioBtn)
            menuElement.appendChild(submitBtnMenu)
            positionMenu(rect.bottom, rect.left)
            calculMode = true

        } else {
            let child = menuElement.firstElementChild;
            while (child) {
                menuElement.removeChild(child);
                child = menuElement.lastElementChild;
            }
            menuElement.classList.add("hidden")
            calculMode = false
        }
        
    }

    menuOpen()

    document.querySelector(".submitMenuBtn").addEventListener("click", () => {
        if (+radioBtn.value) {
            totalGrades = +radioBtn.value

            let child = menuElement.firstElementChild;
            while (child) {
                menuElement.removeChild(child);
                child = menuElement.lastElementChild;
            }

            // let gradeInputs = new DocumentFragment()
            // gradeInputs.classList.add("gradesContainer")
            
            // let parentNode = menuElement.parentNode
            let header = document.createElement("p")
            let headerText = document.createTextNode("Grade Boundaries");
            header.classList.add("menuLgHeader")
            header.appendChild(headerText)
            menuElement.appendChild(header)
        
            for (let i = 0; i < totalGrades; i++) {
                let container = document.createElement("div")
                container.classList.add("container")
                let gradeInput = document.createElement("input")
                gradeInput.classList.add("gradeName")
                gradeInput.placeholder = "Grade:"
                let gradeBoundary = document.createElement("input")
                gradeBoundary.classList.add("gradeLBound")
                gradeBoundary.placeholder = "Bound:"
                container.append(gradeInput, gradeBoundary)
                // gradeInputs.append(container)
                // parentNode.insertBefore(gradeInputs, menuElement)
                menuElement.appendChild(container)
            }

            submitBtnMenu.classList.add("submitBtnGradeBounds")

            menuElement.appendChild(submitBtnMenu)

            document.querySelector(".submitBtnGradeBounds").addEventListener("click", () => {

                console.log("CLICK")
                let vals = document.querySelectorAll(".container > input")

                let ordVal = 0
                
                vals.forEach((node) => {
                    ordVal += 1
                    console.log(node)
                    if (node.value) {
                        
                        if (ordVal % 2 == 0) {
                            if (node.value.includes("%")) {
                                node.value.replace("%", "")
                            }
                            if (+node.value) {
                                let ord = [+node.value, ordVal - 1]
                                gradeLowerBounds.push(ord)
                                
                            } else {
                                // Focus on rogue input
                            }

                        } else {
                            let ord = [node.value, ordVal - 1]
                            grades.push(ord)
                        }
                    }
                    console.log(gradeLowerBounds)
                    console.log(grades)
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

                calculMode = true;
                gradeBoundariesMode()
            })
            


        } else {
            gradeBoundariesMode()
        }
    })
    // gradeBoundariesMode()
    
}


positionMenu = (bottom, left) => {


    menuElement.style.zIndex = "2";
    menuElement.style.position = "absolute";
    menuElement.style.top = bottom + "px";
    menuElement.style.left = left + "px";
    document.querySelector("body").appendChild(menuElement)

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
            let parentNode = document.querySelector(".gradeBounds").parentNode
            parentNode.insertBefore(gradeInputs, document.querySelector(".gradeBounds"))
        }


        document.querySelector(".gradeBounds").classList.remove("hidden")

    }
})

