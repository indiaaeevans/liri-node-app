function readContent(callback) {
    fs.readFile("./random.txt", "utf8", function (err, content) {
        if (err) return callback(err)
        callback(null, content)
    })
}

readContent(function (err, content) {
    console.log(content)
})