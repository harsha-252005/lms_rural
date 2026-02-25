// Debug script - paste this in browser console on Manage Courses page

console.log('=== DEBUG: Manage Courses ===');

// Check localStorage
const userStr = localStorage.getItem('user');
console.log('1. User in localStorage:', userStr);

if (userStr) {
    const user = JSON.parse(userStr);
    console.log('2. Parsed user:', user);
    console.log('3. User ID:', user.id);
    console.log('4. User Role:', user.role);
    
    // Test API call
    const instructorId = user.id;
    const apiUrl = `http://localhost:8080/api/instructors/${instructorId}/courses`;
    console.log('5. API URL:', apiUrl);
    
    fetch(apiUrl)
        .then(res => {
            console.log('6. Response status:', res.status);
            return res.json();
        })
        .then(data => {
            console.log('7. Response data:', data);
            console.log('8. Number of courses:', data.length);
        })
        .catch(err => {
            console.error('9. API Error:', err);
        });
} else {
    console.error('No user found in localStorage!');
}
