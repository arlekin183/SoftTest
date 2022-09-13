const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const columns = [
    { field: "dateAccIn", header: "Дата отчета" },
    { field: "id", header: "ID отчета" },
    { field: "currency", header: "Валюта" },
    { field: "agent", header: "Агент" },
    { field: "pointOfSale", header: "Точка продажи" },
    { field: "dts", header: "Источник данных" },
    { field: "storno", header: "Сторно" },
]
app.use("/", function (request, response) {
    response.send(JSON.stringify(columns.slice(0, 1 + Math.random() * 6)));
});
app.listen(3000);