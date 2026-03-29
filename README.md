## Kanban Board

A role-based task management and workflow optimization platform built using microservices arhitecture.
It allows teams to create, assign, and track tasks visually using a Kanban board, imporving collaboration, productivity and project visibility.

The system includes real-time updates, analytics (pie & bar charts), chat functionality, and AI-powered task assistance.

  
## 🧩 Features
- Role based access control (employee / admin)
- Easy Task Management with limitation
- AI Task Assistant 
- Basic Chat System
- JWT Authentication
- Microservices integration
- Responsive React UI


## ❗Problem Statement

Many teams struggle with inefficient task tracking, lack of real-time visbility and poor coummnication across members.
Traditional tools often fails to provide a clear workflow structure, resulting in delays, miscommunication and reduced productivity.

Additionally, managing tasks across roles (admin and employees) without proper access control and insights becomes difficult in growing teams. 


## 💡Solution

It solves the problem of poor task visibility, delayed communication, and inefficient workflow tracking in teams. 
By providing real-time task updates, chat system, authentication security, and chart analytics, the system helps teams deliver projects faster with better clarity and reduced manual effort.


## 🛠️ Tech Stack
- React
- Material UI
- Spring Boot
- MySQL & MongoDB
- Gemini 2.0 Flash AI Integration


## ⚙️ How the application works
1. Users register/login using JWT-based authentication.
2. Based on role (Admin/Employee), access to features is granted.
3. Admin can:
   - Create boards
   - Assign tasks to employees
   - Monitor progress using charts
4. Employees can:
   - View assigned tasks
   - Update task status (To Do → In Progress → Done)
5. Tasks are managed visually using a Kanban board system.
6. Real-time updates and communication are supported via chat module.
7. AI Task Assistant helps in generating or improving task descriptions.
8. Data is managed through multiple microservices ensuring scalability and modularity.


## ▶️ How to run the code you provided
### Pre-requisites 
    Java 17+, Node.js, MongoDB, MySQL, Maven
### Steps
1. Clone the repository
2. Start each backend microservice and run via mvn::run
3. Update application.properties: MongoDB, MySQL configs
4. Start Frontend: npm install , then npm start
5. Open in browser: http://localhost:3000


## 📸 Output Screenshots
### Home Page
![Home Page](Project Showcase/Screenshots/Home Page.png)

### Board Dashabord (Admin View)
![Admin Board Dashbaord](Project Showcase/Screenshots/Admin Board Dashboard Pic.png)

### Task View 
![Task Pic](Project Showcase/Screenshots/Task Pic.png)

### Chat Window
![Chat Pic](Project Showcase/Screenshots/Chat Pic.png)

## 🏗️ Architecture Diagram
![Architecture](Project Showcase/Screenshots/Architecture Diagram.png)


## 🎥 Project Demo
Watch here: https://youtu.be/D7Hubh9FUaI


## ⚡ Challenges I Faced
- **Microservices Architecture Complexity**  
  Managing communication between multiple services and ensuring proper data flow was challenging.

- **JWT Authentication Implementation**  
  Securing APIs and maintaining token-based authentication across services required careful handling.

- **AI Integration (Gemini API)**  
  Integrating AI features and handling API responses effectively was complex and required multiple iterations.

- **Real-time Chat using WebSockets**  
  Implementing real-time communication and handling message synchronization was technically challenging.

- **State Management in Frontend**  
  Maintaining consistent UI updates with backend data required careful design.

- **Debugging Distributed System Issues**  
  Identifying bugs across multiple services was time-consuming compared to monolithic applications.


## 🚀 Future Improvements

- AI-based task prioritization and time estimation
- Real-time notifications for task updates and deadlines
- Advanced analytics dashboards
- Improved chat system with private channels
- WebSocket-based full real-time updates
- Role-based advanced permissions system
