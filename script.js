let mainGene = "";
let rawFile = ""

const resultSet = [];

const importData = (event) => {
    event.preventDefault();
    const file = document.querySelector("#dataFile").files[0]
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            dataSpliter(evt.target.result, file.name);
        }
        reader.onerror = function (evt) {
            alert("error reading file");
        }
    }
}

const dataSpliter = (rawData, fileName) => {
    let data = rawData.split('\n');
    data.shift();
    data = data.join('').replace(/[^a-zA-Z ]/g, "");
    setMainGene(data, rawData)
    setInfo(data, fileName)
}

const getSequence = (event) => {
    event.preventDefault();
    const geneName = document.querySelector("#geneName").value
    const geneStart = parseInt(document.querySelector("#geneStart").value) - 1 //? parse normal number to index
    const geneEnd = parseInt(document.querySelector("#geneEnd").value)
    const result = getGeneFromSequence(geneStart, geneEnd)

    resultSet.push({"name": geneName, "gene": result})
    displayData()
}

const getGeneFromSequence = (start, end) => {
    let dash = start > 0 ? '-'.repeat(start) : ""
    return dash + getMainGene().substring(start, end)
}

const setMainGene = (data, rawData) => {
    mainGene = data;
    rawFile = rawData;
}

const setInfo = (data, fileName) => {
    console.log(data)
    document.querySelector("#dataInfo").innerHTML = `
    <p>filename : ${fileName} <br>
    total base pairs : ${data.length.toLocaleString()} pairs</p>
    `
}

const getMainGene = () => {
    return mainGene;
}

const removeResult = (index) => {
    resultSet.splice(index, 1)
    displayData()
}


const displayData = () => {
    let innerHTML = `
    <tr>
        <th>Name</th>
        <th>Gene</th>
        <th>Action</th>
    </tr>
    `
    resultSet.forEach((geneSet, index) => {
        innerHTML += 
        `
        <tr>
            <td>${geneSet.name}</td>
            <td>${geneSet.gene}</td>
            <td><button type="button" class="btn btn-danger" onclick="removeResult(${index})">Delete</button></td>
        </tr>
        `
    })
    document.querySelector("#preview").innerHTML = innerHTML
}

const downloadFile = () => {
    const fileName = document.querySelector("#fileName").value;
    const link = document.createElement("a");
    const content = buildText();
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = fileName ? fileName : "gene.txt";
    link.click();
    URL.revokeObjectURL(link.href);
 };

 const buildText = () => {
    geneResult = rawFile
    resultSet.forEach((geneSet) => {
        let text = `>${geneSet.name}\n${geneSet.gene.replace(/[^a-zA-Z ]/g, "")}`
        geneResult += '\n' + text
    })
    return geneResult
 }