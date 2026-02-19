# ChemMastery API Documentation

## Authentication
Most endpoints require authentication. The API uses session-based authentication via NextAuth.js.
Protected endpoints return `401 Unauthorized` if not authenticated.

## Endpoints

### Courses

#### `GET /api/courses`
Get a list of all courses visible to the user.
- **Role Access**:
  - `STUDENT`: Enrolled courses.
  - `TEACHER`: Created courses.
  - `ADMIN`: All courses.

#### `GET /api/courses/[courseId]`
Get details of a specific course.
- **Response**: `Course` object with relations (teacher, students, assignments, resources).

#### `POST /api/courses`
Create a new course.
- **Role Access**: `TEACHER`, `ADMIN`
- **Body**:
  ```json
  {
    "title": "Course Title",
    "description": "Course Description"
  }
  ```

#### `PATCH /api/courses/[courseId]`
Update a course.
- **Role Access**: `TEACHER` (owner), `ADMIN`

#### `DELETE /api/courses/[courseId]`
Delete a course.
- **Role Access**: `TEACHER` (owner), `ADMIN`

### Student Profile

#### `GET /api/student/profile`
Get the profile of the currently logged-in student.

### Teacher Profile

#### `GET /api/teacher/profile`
Get the profile of the currently logged-in teacher.

### Resources

#### `GET /api/resources`
Get a list of learning resources.
- **Query Params**: `type` (optional), `courseId` (optional)

### Schedule (Upcoming)
#### `GET /api/schedule`
Get the weekly batch schedule.
