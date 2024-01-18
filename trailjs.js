const itemsPerPage = 10;
let currentPage = 1;
let totalRepositories = 0;
let totalPages = 0;


async function fetchRepositories() {
  const username = document.getElementById('username').value;
  const repositoriesContainer = document.getElementById('repositories');
  const paginationContainer = document.getElementById('pagination');
 
  if (!username) {
    alert('Please enter a GitHub username.');
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const repositories = await response.json();

    if (response.ok) {
      totalRepositories = repositories.length;
      totalPages = Math.ceil(totalRepositories / itemsPerPage);
      displayRepositories(repositoriesContainer, repositories);
      displayPagination(paginationContainer);
    } else {
      alert(`Error: ${repositories.message}`);
    }
  } catch (error) {
    console.error('Error fetching repositories:', error);
    alert('An error occurred while fetching repositories.');
  }
}

function displayRepositories(container, repositories) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  container.innerHTML = '';

  if (repositories.length === 0) {
    container.innerHTML = '<p>No repositories found.</p>';
    return;
  }

  repositories.slice(start, end).forEach(repo => {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.textContent = repo.name;

    const languageButton = document.createElement('button');
    languageButton.textContent = repo.language || 'Unknown';
    languageButton.className = 'language-button';

    gridItem.appendChild(languageButton);
    container.appendChild(gridItem);
  });
}

function displayPagination(container) {
  container.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.addEventListener('click', () => {
      currentPage = i;
      fetchRepositories();
    });

    container.appendChild(pageButton);
  }
}
