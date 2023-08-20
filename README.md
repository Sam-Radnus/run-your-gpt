<div style="text-align: justify"> 

# Run Your GPT with React and Django

Welcome to the Run Your GPT project! This repository contains a frontend application built with React that allows users to chat with a custom AI model, and a backend built with Django.

## Demo
(Unlisted Video):-https://www.youtube.com/watch?v=1Zlipw28ll4
## Prerequisites:

 - Node.js and npm
 - Python and pip
 - Django

## Setting Up and Running the Project:

### Frontend (React):
Navigate to the project directory:
` cd project `
#### Install the required npm packages:

` npm install `
#### Run the React development server:
` npm start `
\
\
This will start the React app, and it should automatically open in your default browser at http://localhost:3000.

### Backend (Django):
Navigate to the server directory: `cd server`
\
create and run a Virtual Environment first using the following commands 
#### In windows PC
 ``` 
  virtualenv env
  env\scripts\activate
 ```
#### In MacOS
 ``` 
  virtualenv env
  source env/bin/activate
 ```
#### Install the required Python packages (it's recommended to use a virtual environment):
```
 pip install django
 pip install djangorestframework
 pip install djangorestframework_simplejwt
 pip install django-cors-headers
 python manage.py makemigrations

```
#### Run the Django development server:
`python manage.py runserver`

This will start the Django server at http://localhost:8000.
#### Integrating the AI Model:
The AI model needs to be integrated for the chat functionality. Follow the instructions provided in the Google Colab Notebook (https://colab.research.google.com/drive/1BkL7zYVYtn0JPYKMPJ0tJmK-zMtINx0P?usp=sharing) to set up the AI model and establish a WebSocket connection.

### Additional Information:

Ensure CORS configurations are set up correctly in Django settings to allow requests from the React frontend.
<b>The React frontend communicates with the AI model using the provided example Python file</b>. Ensure the WebSocket connection is established correctly for real-time chat functionality.
<b>The number of messages a user can send is limited to 25</b>. Implemented a Signup and Login Sytem using Django. Dynamic and User Friendly UI as well. 
This README provides a comprehensive guide to set up and run the project locally. Ensure you have the necessary prerequisites installed and follow the instructions step by step. If you encounter any issues, refer to the original documentation or reach out for support.
</div>
