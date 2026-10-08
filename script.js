const repositoryList = document.querySelector("#repository-list");
const statusMessage = document.querySelector("#status");

function createRepositoryCard(repository) {
  const item = document.createElement("li");
  item.className = "repository-card";

  const link = document.createElement("a");
  link.className = "repository-name";
  link.href = repository.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = repository.full_name;

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent = repository.description || "No description provided.";

  const metadata = document.createElement("div");
  metadata.className = "repository-meta";

  if (repository.language) {
    const language = document.createElement("span");
    language.textContent = repository.language;
    metadata.append(language);
  }

  if (repository.starred_at) {
    const starredDate = document.createElement("span");
    const date = new Date(`${repository.starred_at}T00:00:00`);
    starredDate.textContent = `Starred ${Number.isNaN(date.getTime())
      ? repository.starred_at
      : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date)}`;
    metadata.append(starredDate);
  }

  item.append(link, description, metadata);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Could not load repositories (${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a JSON array.");
    }

    repositoryList.replaceChildren(...repositories.map(createRepositoryCard));
    statusMessage.textContent = repositories.length
      ? `${repositories.length} repositories`
      : "No starred repositories yet.";
  } catch (error) {
    console.error("Failed to load starred repositories:", error);
    statusMessage.textContent = "Repositories could not be loaded. Please try again later.";
  }
}

loadRepositories();
