// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// State
let currentUser = null;
let isAdmin = false;
let allPlants = [];
let selectedPlantForEdit = null;

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const plantDetailsModal = document.getElementById('plantDetailsModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const addPlantForm = document.getElementById('addPlantForm');
const plantsContainer = document.getElementById('plantsContainer');
const authButtons = document.getElementById('authButtons');
const userMenu = document.getElementById('userMenu');
const userEmail = document.getElementById('userEmail');
const navMenu = document.getElementById('navMenu');
const adminLink = document.getElementById('adminLink');
const adminSection = document.getElementById('admin');
const toast = document.getElementById('toast');

// Modal Controls
const closeLoginModal = document.getElementById('closeLoginModal');
const closeSignupModal = document.getElementById('closeSignupModal');
const closePlantModal = document.getElementById('closePlantModal');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');

// Event Listeners
loginBtn.addEventListener('click', () => openModal(loginModal));
signupBtn.addEventListener('click', () => openModal(signupModal));
logoutBtn.addEventListener('click', logout);
closeLoginModal.addEventListener('click', () => closeModal(loginModal));
closeSignupModal.addEventListener('click', () => closeModal(signupModal));
closePlantModal.addEventListener('click', () => closeModal(plantDetailsModal));
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    openModal(signupModal);
});
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(signupModal);
    openModal(loginModal);
});
loginForm.addEventListener('submit', handleLogin);
signupForm.addEventListener('submit', handleSignup);
addPlantForm.addEventListener('submit', handleAddPlant);

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === loginModal) closeModal(loginModal);
    if (event.target === signupModal) closeModal(signupModal);
    if (event.target === plantDetailsModal) closeModal(plantDetailsModal);
});

// Helper Functions
function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

function showToast(message, isError = false) {
    toast.textContent = message;
    toast.className = isError ? 'toast error' : 'toast';
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
}

// Auth Functions
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || 'Login failed', true);
            return;
        }

        setToken(data.accessToken);
        showToast('Login successful!');
        closeModal(loginModal);
        loginForm.reset();
        await checkUserStatus();
        loadPlants();
    } catch (error) {
        showToast('Error: ' + error.message, true);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || 'Signup failed', true);
            return;
        }

        showToast('Signup successful! Please login.');
        closeModal(signupModal);
        signupForm.reset();
        openModal(loginModal);
    } catch (error) {
        showToast('Error: ' + error.message, true);
    }
}

async function checkUserStatus() {
    const token = getToken();
    if (!token) {
        currentUser = null;
        isAdmin = false;
        updateUI();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/current`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            isAdmin = currentUser.role === 'admin';
            updateUI();
        } else {
            removeToken();
            currentUser = null;
            isAdmin = false;
            updateUI();
        }
    } catch (error) {
        console.error('Error checking user status:', error);
        removeToken();
        currentUser = null;
        isAdmin = false;
        updateUI();
    }
}

function logout() {
    removeToken();
    currentUser = null;
    isAdmin = false;
    updateUI();
    adminSection.style.display = 'none';
    showToast('Logged out successfully!');
    loadPlants();
}

function updateUI() {
    if (currentUser) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        userEmail.textContent = currentUser.email;
        
        if (isAdmin) {
            adminLink.style.display = 'block';
        } else {
            adminLink.style.display = 'none';
            adminSection.style.display = 'none';
        }
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
        adminLink.style.display = 'none';
        adminSection.style.display = 'none';
    }
    loadPlants();
}

// Plant Functions
async function loadPlants() {
    try {
        const response = await fetch(`${API_BASE_URL}/plants`);
        const data = await response.json();
        
        // For now, create mock data since the backend returns a simple message
        allPlants = [
            {
                _id: '1',
                name: 'Monstera Deliciosa',
                price: 45.99,
                category: 'Tropical',
                stock: 15,
                description: 'Large tropical plant with distinctive split leaves. Perfect for bright indoor spaces.'
            },
            {
                _id: '2',
                name: 'Pothos',
                price: 12.99,
                category: 'Climbing',
                stock: 25,
                description: 'Easy-to-grow climbing plant. Great for beginners. Can be grown in water or soil.'
            },
            {
                _id: '3',
                name: 'Snake Plant',
                price: 22.50,
                category: 'Succulents',
                stock: 30,
                description: 'Low-maintenance succulent. Air-purifying. Perfect for any room.'
            },
            {
                _id: '4',
                name: 'Fiddle Leaf Fig',
                price: 65.00,
                category: 'Trees',
                stock: 8,
                description: 'Statement plant with large, lyre-shaped leaves. Needs bright light.'
            },
            {
                _id: '5',
                name: 'ZZ Plant',
                price: 28.99,
                category: 'Easy Care',
                stock: 20,
                description: 'Extremely low maintenance. Tolerates low light. Great for offices.'
            },
            {
                _id: '6',
                name: 'Philodendron',
                price: 18.99,
                category: 'Vining',
                stock: 18,
                description: 'Heart-shaped leaves. Easy to propagate. Thrives in indirect light.'
            }
        ];
        
        renderPlants(allPlants);
    } catch (error) {
        showToast('Error loading plants: ' + error.message, true);
    }
}

function renderPlants(plants) {
    plantsContainer.innerHTML = '';
    
    if (plants.length === 0) {
        plantsContainer.innerHTML = '<p>No plants available.</p>';
        return;
    }

    plants.forEach(plant => {
        const plantCard = document.createElement('div');
        plantCard.className = 'plant-card';
        
        let actionsHTML = `<button class="plant-actions" onclick="viewPlantDetails('${plant._id}')"><div class="btn btn-view">View Details</div></button>`;
        
        if (isAdmin) {
            actionsHTML = `
                <button class="btn btn-edit" onclick="editPlant('${plant._id}')">Edit</button>
                <button class="btn btn-delete" onclick="deletePlant('${plant._id}')">Delete</button>
            `;
        }

        plantCard.innerHTML = `
            <div class="plant-image">🌱</div>
            <div class="plant-info">
                <div class="plant-name">${plant.name}</div>
                <div class="plant-category">${plant.category}</div>
                <div class="plant-price">$${plant.price.toFixed(2)}</div>
                <div class="plant-stock">Stock: ${plant.stock}</div>
                <div class="plant-description">${plant.description}</div>
                <div class="plant-actions">
                    ${isAdmin ? actionsHTML : `<button class="btn btn-view" onclick="viewPlantDetails('${plant._id}')">View Details</button>`}
                </div>
            </div>
        `;
        
        plantsContainer.appendChild(plantCard);
    });
}

function viewPlantDetails(plantId) {
    const plant = allPlants.find(p => p._id === plantId);
    if (!plant) return;

    const plantDetails = document.getElementById('plantDetails');
    plantDetails.innerHTML = `
        <h2>${plant.name}</h2>
        <p><strong>Category:</strong> ${plant.category}</p>
        <p><strong>Price:</strong> $${plant.price.toFixed(2)}</p>
        <p><strong>Stock:</strong> ${plant.stock} units available</p>
        <p><strong>Description:</strong> ${plant.description}</p>
        <button class="btn btn-primary" onclick="addToCart('${plant._id}')">Add to Cart</button>
    `;
    
    openModal(plantDetailsModal);
}

function addToCart(plantId) {
    showToast('Added to cart!');
}

function editPlant(plantId) {
    const plant = allPlants.find(p => p._id === plantId);
    if (!plant) return;

    selectedPlantForEdit = plant;
    document.getElementById('plantName').value = plant.name;
    document.getElementById('plantPrice').value = plant.price;
    document.getElementById('plantCategory').value = plant.category;
    document.getElementById('plantStock').value = plant.stock;
    document.getElementById('plantDescription').value = plant.description;

    adminSection.scrollIntoView({ behavior: 'smooth' });
}

async function deletePlant(plantId) {
    if (!confirm('Are you sure you want to delete this plant?')) return;

    const token = getToken();
    if (!token) {
        showToast('Please login to delete plants', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/plants/${plantId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showToast('Plant deleted successfully!');
            loadPlants();
        } else {
            showToast('Error deleting plant', true);
        }
    } catch (error) {
        showToast('Error: ' + error.message, true);
    }
}

async function handleAddPlant(e) {
    e.preventDefault();

    const token = getToken();
    if (!token) {
        showToast('Please login to add plants', true);
        return;
    }

    const plant = {
        name: document.getElementById('plantName').value,
        price: parseFloat(document.getElementById('plantPrice').value),
        category: document.getElementById('plantCategory').value,
        stock: parseInt(document.getElementById('plantStock').value),
        description: document.getElementById('plantDescription').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/plants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(plant)
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Plant added successfully!');
            addPlantForm.reset();
            selectedPlantForEdit = null;
            loadPlants();
        } else {
            showToast(data.message || 'Error adding plant', true);
        }
    } catch (error) {
        showToast('Error: ' + error.message, true);
    }
}

// Handle Admin Link Click
document.addEventListener('DOMContentLoaded', () => {
    adminLink.addEventListener('click', (e) => {
        e.preventDefault();
        adminSection.style.display = adminSection.style.display === 'none' ? 'block' : 'none';
    });

    // Check user status on page load
    checkUserStatus();
});

// Initialize
window.addEventListener('load', () => {
    checkUserStatus();
});
