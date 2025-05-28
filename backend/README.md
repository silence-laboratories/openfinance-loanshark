# Backend service

## Requirements

- [Python3.8](https://www.python.org/downloads/release/python-380/)

## Create the project

Create a project folder and create a virtual environment and activate it.

```bash
python3 -m venv .fiu
source .fiu/bin/activate
```

## Install dependencies

```bash
pip install -r requirements.txt
```

## Run your new app

> Note : Replace necessary values on `util/constants.py` file

Run your app:

```bash
python main.py
```

And it outputs something like:

```bash
* Serving Flask app "main.py"
* Environment: production
  WARNING: This is a development server. Do not use it in a production deployment.
  Use a production WSGI server instead.
* Debug mode: on
* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

By default Flask app run a server in the 5000 port in localhost.  
Now you can send a request to your app:

We added a endpoint prefix `/api/v1` for every route

```bash
curl http://127.0.0.1:5000/api/v1
```

The output should be like:

```bash
Hello world with Flask
```


## Build with Docker

`docker build -t fiu-service:latest .`

## Run with Docker

`docker run -p 5000:5000 fiu-service:latest`

To stop your new app, just press `CTRL + c`

## License

[MIT.](./LICENSE) Copyright (c)
