async function loadHeaderFooter() {
    const headerContent = await fetch('header.html').then(res => res.text());
    const footerContent = await fetch('footer.html').then(res => res.text());
    document.getElementById('header').innerHTML = headerContent;
    document.getElementById('footer').innerHTML = footerContent;
}

loadHeaderFooter();