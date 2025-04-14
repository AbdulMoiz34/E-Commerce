const params = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("q");
};

const searchInput = document.getElementById("search-navbar");
searchInput.value = params();