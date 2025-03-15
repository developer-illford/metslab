async function loadHeaderFooter() {
    const headerContent = await fetch('header.html').then(res => res.text());
    const footerContent = await fetch('footer.html').then(res => res.text());
    document.getElementById('header').innerHTML = headerContent;
    document.getElementById('footer').innerHTML = footerContent;

    console.log(pageIdentifier);
    // Wait for the DOM to update, then add the class
    requestAnimationFrame(() => {
        const activeindex = document.getElementById('index');
        const activeabout = document.getElementById('about');
        const activeservices = document.getElementById('services');
        const activeaccreditations = document.getElementById('accreditations');
        const activecareer = document.getElementById('career');
        const activeblogs = document.getElementById('blogs');
        const activereport = document.getElementById('report');
        const activecontact = document.getElementById('contact');

        if (pageIdentifier == 'index') {
            activeindex.classList.add('active');
        };
        if (pageIdentifier == 'about') {
            activeabout.classList.add('active');
        };
        if (pageIdentifier == 'services') {
            activeservices.classList.add('active');
        };
        if (pageIdentifier == 'accreditations') {
            activeaccreditations.classList.add('active');
        };
        if (pageIdentifier == 'career') {
            activecareer.classList.add('active');
        };
        if (pageIdentifier == 'blogs') {
            activeblogs.classList.add('active');
        };
        if (pageIdentifier == 'report') {
            activereport.classList.add('active');
        };
        if (pageIdentifier == 'contact') {
            activecontact.classList.add('active');
        };
    });
}

loadHeaderFooter();