# Team Task Manager

A full-stack task management application where users can create teams, invite members, and manage tasks collaboratively.

## 🛠 Tech Stack

**Frontend:** React + Vite + Tailwind  
**Backend:** Node.js + Express  
**Database:** PostgreSQL  
**Auth:** Passport (Local Strategy) + Sessions

---

## ✨ Features️ Features

### Authentication
- Register with first name, last name, email, password  
- Secure login using hashed passwords  
- Session-based authentication (cookies)  
- Logout  
- Get current logged-in user  

---

### Teams
- Create a team (creator becomes owner)  
- Update team name (owner only)  
- Delete team (owner only)  
- Add members by email  
- Remove members  
- View all teams you belong to  
- View users available to invite  

---

### Tasks
- Create tasks inside a team  
- Assign tasks to members  
- Edit tasks (title, description, assignee)  
- Delete tasks (creator only)  
- Mark tasks complete / open  

**Filter:**
- My tasks  
- Other team tasks  

--- 
## Getting Started

### Clone the project
```
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
```
### Setup the Database (PostgreSQL)
CREATE DATABASE teamtaskmanager;
- CREATE DATABASE teamtaskmanager;
Required Tables
```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE team_members (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, team_id)
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 ```

- Setup Server
```
cd server
npm install
```

- Create .env
```
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/teamtaskmanager
SESSION_SECRET=supersecret
```

- Run:
```
npm run dev
# or
node server.js
```

- Server runs on:
```
http://localhost:8080
```

- Setup Client
```
cd client
npm install
npm run dev
```

- Client runs on:
```
http://localhost:5173
```

## API Routes

- auth
<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Route</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/auth/register</td>
      <td>Create account</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/auth/login</td>
      <td>Login</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/auth/me</td>
      <td>Current user</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/auth/logout</td>
      <td>Logout</td>
    </tr>
  </tbody>
</table>

- teams
<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Route</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>GET</td>
      <td>/teams</td>
      <td>My teams</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/teams</td>
      <td>Create</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/teams/:id</td>
      <td>Update (owner)</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/teams/:id</td>
      <td>Delete (owner)</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/teams/:id/members</td>
      <td>Team members</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/teams/:id/members</td>
      <td>Add by email</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/teams/:teamId/members/:userId</td>
      <td>Remove</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/teams/:id/available-users</td>
      <td>Users to invite</td>
    </tr>
  </tbody>
</table>

- tasks
<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Route</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>GET</td>
      <td>/tasks?team_id=</td>
      <td>Team tasks</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/tasks</td>
      <td>Create</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/tasks/:id</td>
      <td>Update</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/tasks/status/:id</td>
      <td>Change status</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/tasks/:id</td>
      <td>Delete (creator)</td>
    </tr>
  </tbody>
</table>

## 🚀 Future Improvements (Ideas)

- Role system (admin/member)
- Due dates & priority
- Comments
- Activity history
- Notifications
- Drag & drop board
- Search & filters
- Pagination
- Unit tests
- Docker setup

---

## 👨‍💻 Author

**Your Name**  
GitHub: [@Sye0x](https://github.com/Sye0x)
