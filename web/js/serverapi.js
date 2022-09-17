URL = {
  base: "https://pbsc.jmjdrwrk.repl.co",
  auth: "develop"
}


class ServerApi {
  static async test() {
    Console.log('testing ServerApi')

    Console.log('tested ServerApi')
  }
  static async doPost(rUrl, jbody) {
    let promise = new Promise((resolve, reject) => {
      try {
        console.log(`attemptigng ${URL.base}${rUrl}`)
        fetch(`${URL.base}${rUrl}`,
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'auth': URL.auth
            },
            body: JSON.stringify(jbody)
          })
          .then(response => response.json())
          .then(data => resolve(data));

      } catch (err) {
        reject(`POST ERROR ${err}`)
      }
    })
    return promise
  }

  static async doGet(rUrl) {
    let promise = new Promise((resolve, reject) => {
      try {
        fetch(`${URL.base}${rUrl}`,
          {
            method: 'GET',
            headers: {
              'auth': URL.auth
            }
          })

          .then(response => response.json())
          .then(data => resolve(data));

      } catch (err) {
        reject(`GET ERROR ${err}`)
      }
    })
    return promise
  }

  static async RAW_GET(rUrl) {
    let promise = new Promise((resolve, reject) => {
      try {
        fetch(rUrl,
          {
            method: 'GET',
            headers: {
              'auth': URL.auth
            }
          })

          .then(response => response.json())
          .then(data => resolve(data));

      } catch (err) {
        reject(`GET ERROR ${err}`)
      }
    })
    return promise
  }
}