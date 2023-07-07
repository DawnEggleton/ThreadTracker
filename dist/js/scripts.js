const sheet = `https://opensheet.elk.sh/1KDKs6Kh7dXd9V3Vgcw9ipLPiaDsUqiyRPNGYw7wFnsQ`;
let threads = [];
var filters = {};
const typeSearch = `#quicksearch`;
const threadTitle = `.thread--title`;
const visible = `is-visible`;
const filterGroup = `.tracker--filter-group`;
const filterOptions = `.tracker--filter-group input`;
const sorts = `.tracker--header button`;
const gridItem = `.grid-item`;
const defaultShow = `.thread:not(.complete)`;

let form = document.querySelector('#add-thread');
if(form) {
    fetch(`${sheet}/Sites`)
    .then((response) => response.json())
    .then((siteData) => {
        fetch(`${sheet}/Characters`)
        .then((response) => response.json())
        .then((characterData) => {
            fetch(`${sheet}/Featured`)
            .then((response) => response.json())
            .then((featureData) => {
                let siteList = document.querySelector('#site');
                let characterList = document.querySelector('#character');
                let partnerList = document.querySelector('#partner');
                let featureList = document.querySelector('#featuring');
                siteData.sort((a, b) => {
                    if (a.Site < b.Site) {
                        return -1;
                    } else if (a.Site > b.Site) {
                        return 1;
                    } else {
                        return 0;
                    }
                })

                let siteHTML = siteData.map(item => `<option value="${item.Site}">${item.Site}</option>`);
                siteList.insertAdjacentHTML('beforeend', siteHTML);

                siteList.addEventListener('change', e => {
                    let siteName = e.currentTarget.options[e.currentTarget.selectedIndex].value;
                    let characters = characterData.filter(item => item.Site === siteName);
                    let partners = featureData.filter(item => item.Site === siteName);
                    let uniquePartners = [];
                    partners.forEach(partner => {
                        let partnerObject = {
                            'partner': partner.Writer,
                            'partnerID': partner.WriterID
                        };
                        let inArray = false;
                        uniquePartners.forEach(unique => {
                            if(unique.partner === partnerObject.partner) {
                                inArray = true;
                            }
                        });
                        if (!inArray) {
                            uniquePartners.push(partnerObject);
                        }
                    });

                    characters.sort((a, b) => {
                        if (a.Character < b.Character) {
                            return -1;
                        } else if (a.Character > b.Character) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                    uniquePartners.sort((a, b) => {
                        if (a.Character < b.Character) {
                            return -1;
                        } else if (a.Character > b.Character) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });

                    let characterHTML = characters.map(item => `<option value="${item.CharacterID}">${item.Character}</option>`);
                    characterList.insertAdjacentHTML('beforeend', characterHTML);
                    let partnerHTML = uniquePartners.map(item => `<option value="${item.partnerID}">${item.partner}</option>`);
                    partnerList.insertAdjacentHTML('beforeend', partnerHTML);
                });

                partnerList.addEventListener('change', e => {
                    let siteName = siteList.options[siteList.selectedIndex].value;
                    let partnerName = e.currentTarget.options[e.currentTarget.selectedIndex].innerText;
                    let featureOptions = featureData.filter(item => item.Site === siteName && item.Writer === partnerName);
                    console.log(partnerName);
                    console.log(featureOptions);
                    featureOptions.sort((a, b) => {
                        if (a.Character < b.Character) {
                            return -1;
                        } else if (a.Character > b.Character) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });

                    let featureHTML = featureOptions.map(item => `<option value="${item.CharacterID}">${item.Character}</option>`);
                    featureList.insertAdjacentHTML('beforeend', featureHTML);
                });

                form.addEventListener('submit', e => {
                    e.preventDefault();
                    e.currentTarget.querySelector('button[type="submit"]').innerText = 'Submitting...';
                    addThread(e);
                });
            });
        });
    });
}