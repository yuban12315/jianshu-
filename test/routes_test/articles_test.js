let request = require('superagent')
let article = {
    title: 'test_title',
    content: '# test_h1',
    user_id: 1,
    publish_date: new Date()
}

request.post('127.0.0.1/articles/to_html', {
    title: 'test_title',
    content: '# test_h1',
    user_id: 1,
    publish_date: new Date()
}, (err, res) => {

    if (res) {
        console.log(JSON.parse(res.text))
    }
})
