document.addEventListener("DOMContentLoaded", function () {
    const buttonAdd = document.querySelector(".add-number");
    const buttonMin = document.querySelector(".min-number");
    let count = document.querySelector(".value");
    let value = +count.textContent

    buttonAdd.addEventListener("click", () => {
        value = ++value;
        count.textContent = value;
        console.log(value);
        count.style.color = "green";
    })

    buttonMin.addEventListener("click", () => {
        value = --value
        count.textContent = value;
        count.style.color = "red";
    })

    console.log(buttonAdd, buttonMin, count, value);

    const namesArray = ["Mohamed", "Ahmed", "Eman", "Alam"]

    const namesElements = document.querySelectorAll(".names")

    for (let x of namesArray) {
        console.log(x)
    }

    namesArray.forEach((x, index) => {
        if (namesElements[index]) {
            namesElements[index].textContent = x
        }
    })

    newArray = namesArray.map((index) => {
        return "👺"
    })
    console.log(newArray)

});
