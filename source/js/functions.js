function getMonthName(monthNum) {
    switch(monthNum) {
        case 0:
            return 'january';
            break;
        case 1:
            return 'february';
            break;
        case 2:
            return 'march';
            break;
        case 3:
            return 'april';
            break;
        case 4:
            return 'may';
            break;
        case 5:
            return 'june';
            break;
        case 6:
            return 'july';
            break;
        case 7:
            return 'august';
            break;
        case 8:
            return 'september';
            break;
        case 9:
            return 'october';
            break;
        case 10:
            return 'november';
            break;
        case 11:
            return 'december';
            break;
        default:
            break;
    }
}
function getDelay(date) {
    let elapsed = (new Date() - Date.parse(date)) / (1000*60*60*24);
    let delayClass;
    if(elapsed > 365) {
        delayClass = 'year';
    } else if (elapsed > 180) {
        delayClass = 'half';
    } else if (elapsed > 90) {
        delayClass = 'quarter';
    } else if (elapsed > 30) {
        delayClass = 'month';
    } else if (elapsed > 7) {
        delayClass = 'week';
    } else {
        delayClass = 'okay';
    }
    return delayClass;
}
function formatThread(site, siteURL, status, character, feature, title, threadID, icDate, partner, type, lastPost, delayClass, directoryString) {
    let html = `<div class="thread lux-track grid-item status--${status} ${character.split(' ')[0]} delay--${delayClass} type--${type.split(' ')[0]} partner--${partner.split('#')[0].replace(' ', '')} grid-item"><div class="thread--wrap">
        <a class="thread--character" href="${siteURL}/?showuser=${character.split('#')[1]}">${character.split('#')[0]}</a>
        <a href="${siteURL}/?showtopic=${threadID}&view=getnewpost" target="_blank" class="thread--title">${title}</a>
        <span class="thread--feature">ft. <a href="${siteURL}/?showuser=${feature.split('#')[1]}">${feature.split('#')[0]}</a></span>
        <span class="thread--partners">Writing with <a href="${siteURL}/${directoryString}${partner.split('#')[1]}">${feature.split('#')[0]}</a></span>
        <span class="thread--ic-date">Set <span>${icDate}</span></span>
        <span class="thread--last-post">Last Active <span>${lastPost}</span></span>
        <div class="thread--buttons">
            <button onClick="changeStatus(this)" data-status="${status}" data-id="${threadID}" data-site="${site}">Change Turn</button>
            <button onClick="markComplete(this)" data-id="${threadID}" data-site="${site}">Mark Complete</button>
        </div>
    </div></div>`;

    return html;
}
function sendAjax(data, form = null) {
    console.log('send ajax');
    $.ajax({
        url: `https://script.google.com/macros/s/AKfycbwBKbff630nx14XxqQfJJCcKU5u444qf0WZ8w1q9FMFCvG38MKLMm_F_ctvZV9KUhd2bw/exec`,   
        data: data,
        method: "POST",
        type: "POST",
        dataType: "json", 
        success: function () {
            console.log('success');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
        },
        complete: function () {
            console.log('complete');
            if(form) {
                form.originalTarget.querySelector('button[type="submit"]').innerText = 'Submit';
            }
        }
    });
}
function changeStatus(e) {
    if(e.dataset.status === 'mine' || e.dataset.status === 'start') {
        e.dataset.status = 'theirs';
        let thread = e.parentNode.parentNode.parentNode;
        thread.classList.remove('status--mine');
        thread.classList.remove('status--start');
        thread.classList.add('status--theirs');
        sendAjax({
            'SubmissionType': 'edit-thread',
            'ThreadID': e.dataset.id,
            'Site': e.dataset.site,
            'Status': 'Theirs'
        });
    } else if(e.dataset.status === 'theirs' || e.dataset.status === 'expected') {
        e.dataset.status = 'mine';
        let thread = e.parentNode.parentNode.parentNode;
        thread.classList.remove('status--theirs');
        thread.classList.remove('status--expecting');
        thread.classList.add('status--mine');
        sendAjax({
            'SubmissionType': 'edit-thread',
            'ThreadID': e.dataset.id,
            'Site': e.dataset.site,
            'Status': 'Mine'
        });
    }
}
function markComplete(e) {
    e.dataset.status = 'complete';
    let thread = e.parentNode.parentNode.parentNode;
    thread.classList.remove('status--mine');
    thread.classList.remove('status--start');
    thread.classList.remove('status--theirs');
    thread.classList.remove('status--expecting');
    thread.classList.add('status--complete');
    sendAjax({
        'SubmissionType': 'edit-thread',
        'ThreadID': e.dataset.id,
        'Site': e.dataset.site,
        'Status': 'Complete'
    });
}
function addThread(e) {
    let site = e.currentTarget.querySelector('#site').options[e.currentTarget.querySelector('#site').selectedIndex].value,
        status = e.currentTarget.querySelector('#status').options[e.currentTarget.querySelector('#site').selectedIndex].innerText,
        character = `${e.currentTarget.querySelector('#character').options[e.currentTarget.querySelector('#character').selectedIndex].      innerText}#${e.currentTarget.querySelector('#character').options[e.currentTarget.querySelector('#character').selectedIndex].value}`,
        featuring = `${e.currentTarget.querySelector('#featuring').options[e.currentTarget.querySelector('#featuring').selectedIndex].innerText}#${e.currentTarget.querySelector('#featuring').options[e.currentTarget.querySelector('#featuring').selectedIndex].value}`,
        title = e.currentTarget.querySelector('#title').value,
        threadID = e.currentTarget.querySelector('#id').value,
        icDate = e.currentTarget.querySelector('#date').value,
        partner = `${e.currentTarget.querySelector('#partner').options[e.currentTarget.querySelector('#partner').selectedIndex].innerText}#${e.currentTarget.querySelector('#partner').options[e.currentTarget.querySelector('#partner').selectedIndex].value}`,
        type = e.currentTarget.querySelector('#type').options[e.currentTarget.querySelector('#type').selectedIndex].innerText,
        year = new Date().getFullYear(),
        month = getMonthName(new Date().getMonth()),
        day = new Date().getDate(),
        update = `${month} ${day}, ${year}`;

    sendAjax({
        'SubmissionType': 'new-thread',
        'Site': site,
        'Status': status,
        'Character': character,
        'Featuring': featuring,
        'Title': title,
        'ThreadID': threadID,
        'ICDate': icDate,
        'Partner': partner,
        'Type': type,
        'LastUpdated': update
    }, e);
}
function populatePage(array, siteObject) {
    let html = ``;
    let characters = [], partners = [];

    for (let i = 0; i < array.length; i++) {
        //Make Character Array
        let character = array[i].Character.toLowerCase();
        let partner = array[i].Partner.toLowerCase();

        if(jQuery.inArray(character, characters) == -1 && character != '') {
            characters.push(character);
        }
        if(jQuery.inArray(partner, partners) == -1 && partner != '') {
            partners.push(partner);
        }

        html += formatThread(siteObject.Site,
                            siteObject.URL,
                            array[i].Status.toLowerCase(),
                            array[i].Character.toLowerCase(),
                            array[i].Featuring.toLowerCase(),
                            array[i].Title.toLowerCase(),
                            array[i].ThreadID,
                            array[i].ICDate.toLowerCase(),
                            array[i].Partner.toLowerCase(),
                            array[i].Type.toLowerCase(),
                            array[i].LastUpdated.toLowerCase(),
                            getDelay(array[i].LastUpdated),
                            siteObject.Directory);
    }
    document.querySelector('#tracker--rows').insertAdjacentHTML('beforeend', html);

    //sort appendable filters
    characters.sort();
    partners.sort();

    //Append filters
    characters.forEach(character => {
        document.querySelector('.tracker--characters').insertAdjacentHTML('beforeend', `<label><input type="checkbox" value=".${character.split(' ')[0]}"/>${character.split(' ')[0]}</label>`);
    });
    partners.forEach(partner => {
        document.querySelector('.tracker--partners').insertAdjacentHTML('beforeend', `<label><input type="checkbox" value=".partner--${partner.split('#')[0].replace(' ', '')}"/>${partner.split('#')[0]}</label>`);
    });
}
function debounce(fn, threshold) {
    var timeout;
    return function debounced() {
        if (timeout) {
        clearTimeout(timeout);
        }

        function delayed() {
        fn();
        timeout = null;
        }
        setTimeout(delayed, threshold || 100);
    };
}
function setCustomFilter() {
    //get search value
    qsRegex = document.querySelector(typeSearch).value;
    elements = document.querySelectorAll(gridItem);
    
    //add show class to all items to reset
    elements.forEach(el => el.classList.add(visible));
    
    //filter by nothing
    let searchFilter = '';
    
    //check each item
    elements.forEach(el => {
        let name = el.querySelector(threadTitle).textContent;
        if(!name.toLowerCase().includes(qsRegex)) {
            el.classList.remove(visible);
            searchFilter = `.${visible}`;
        }
    });

    let filterGroups = document.querySelectorAll(filterGroup);
    let groups = [];
    let checkFilters;
    filterGroups.forEach(group => {
        let filters = [];
        group.querySelectorAll('label.is-checked input').forEach(filter => {
            if(filter.value) {
                filters.push(filter.value);
            }
        });
        groups.push({group: group.dataset.filterGroup, selected: filters});
    });

    let filterCount = 0;
    let comboFilters = [];
    groups.forEach(group => {
        // skip to next filter group if it doesn't have any values
        if ( group.selected.length > 0 ) {
            if ( filterCount === 0 ) {
                // copy groups to comboFilters
                comboFilters = group.selected;
            } else {
                var filterSelectors = [];
                var groupCombo = comboFilters;
                // merge filter Groups
                for (var k = 0; k < group.selected.length; k++) {
                    for (var j = 0; j < groupCombo.length; j++) {
                        //accommodate weirdness with object vs not
                        if(groupCombo[j].selected) {
                            if(groupCombo[j].selected != group.selected[k]) {
                                filterSelectors.push( groupCombo[j].selected + group.selected[k] );
                            }
                        } else if (!groupCombo[j].selected && group.selected[k]) {
                            if(groupCombo[j] != group.selected[k]) {
                                filterSelectors.push( groupCombo[j] + group.selected[k] );
                            }
                        }
                    }
                }
                // apply filter selectors to combo filters for next group
                comboFilters = filterSelectors;
            }
            filterCount++;
        }
    });
    
    //set filter to blank
    let filter = [];
    //check if it's only search
    if(qsRegex.length > 0 && comboFilters.length === 0) {
        filter = [`.${visible}`];
    }
    //check if it's only checkboxes
    else if(qsRegex.length === 0 && comboFilters.length > 0) {
        let combos = comboFilters.join(',').split(',');
        filter = [...combos];
    }
    //check if it's both
    else if (qsRegex.length > 0 && comboFilters.length > 0) {
        let dualFilters = comboFilters.map(filter => filter + `.${visible}`);
        filter = [...dualFilters];
    }

    //join array into string
    filter = filter.join(', ');
    
    //render isotope
    $container.isotope({
        filter: filter
    });
}
function initIsotope() {
    //use value of input select to filter
    let checkboxes = document.querySelectorAll(filterOptions);
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', e => {
            if(e.currentTarget.classList.contains('all')) {
                e.currentTarget.checked = true;
                e.currentTarget.parentElement.classList.add('is-checked');
                e.currentTarget.parentElement.parentElement.querySelectorAll('input:not(.all)').forEach(input => {
                    input.checked = false;
                    input.parentElement.classList.remove('is-checked');
                });
            } else {
                if(e.currentTarget.parentElement.classList.contains('is-checked')) {
                    e.currentTarget.checked = false;
                    e.currentTarget.parentElement.classList.remove('is-checked');
                } else {
                    e.currentTarget.checked = true;
                    e.currentTarget.parentElement.classList.add('is-checked');
                    e.currentTarget.parentElement.parentElement.querySelector('input.all').checked = false;
                    e.currentTarget.parentElement.parentElement.querySelector('input.all').parentElement.classList.remove('is-checked');
                }
            }
            let labels = e.currentTarget.parentElement.parentElement.querySelectorAll('label');
            let checked = 0;
            labels.forEach(label => {
                if(label.classList.contains('is-checked')) {
                    checked++;
                }
            });
            if(checked === 0) {
                e.currentTarget.parentElement.parentElement.querySelector('input.all').checked = true;
                e.currentTarget.parentElement.parentElement.querySelector('input.all').parentElement.classList.add('is-checked');
            }
            //set filters
            setCustomFilter();
        });
    });

    // use value of search field to filter
    document.querySelector(typeSearch).addEventListener('keyup', e => {
        setCustomFilter();
    });

    // bind sort button click
    let sortButtons = document.querySelectorAll(sorts);
    sortButtons.forEach(button => {
        button.addEventListener('click', e => {
            let sortValue = e.currentTarget.dataset.sort;
            $container.isotope({ sortBy: sortValue });
            sortButtons.forEach(button => {
                button.classList.remove('is-checked');
            });
            e.currentTarget.classList.add('is-checked');
        });
    });
}
function prepThreads(data, site) {
    let threads = data.filter(item => item.Site === site);
    threads.sort((a, b) => {
        let aStatus = a.Status.toLowerCase() === 'complete' ? 1 : 0;
        let bStatus = b.Status.toLowerCase() === 'complete' ? 1 : 0;
        if(a.Character < b.Character) {
            return -1;
        } else if (a.Character > b.Character) {
            return 1;
        } else if(aStatus < bStatus) {
            return -1;
        } else if (aStatus > bStatus) {
            return 1;
        } else if(new Date(a.ICDate) < new Date(b.ICDate)) {
            return -1;
        } else if (new Date(a.ICDate) > new Date(b.ICDate)) {
            return 1;
        } else if(new Date(a.LastUpdate) < new Date(b.LastUpdate)) {
            return -1;
        } else if (new Date(a.LastUpdate) > new Date(b.LastUpdate)) {
            return 1;
        } else {
            return 0;
        }
    });
    return threads;
}
function fillThreadForm(siteData, characterData, featureData, form) {
    fillSiteSelect(siteData, form);
    let characterList = document.querySelector('#character');
    let partnerList = document.querySelector('#partner');
    let featureList = document.querySelector('#featuring');

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
}
function fillSiteSelect(siteData, form) {
    let siteList = form.querySelector('#site');
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
}
function addCharacter(e) {
    let site = e.currentTarget.querySelector('#site').options[e.currentTarget.querySelector('#site').selectedIndex].value,
        character = e.currentTarget.querySelector('#character').value,
        characterID = e.currentTarget.querySelector('#id').value;

    sendAjax({
        'SubmissionType': 'new-character',
        'Site': site,
        'Character': character,
        'CharacterID': characterID
    }, e);
}
function addSite(e) {
    let directory = e.currentTarget.querySelector('#directory').options[e.currentTarget.querySelector('#directory').selectedIndex].value,
        url = e.currentTarget.querySelector('#url').value,
        site = e.currentTarget.querySelector('#name').value;

    sendAjax({
        'SubmissionType': 'new-site',
        'Site': site,
        'URL': url,
        'Directory': directory
    }, e);
}
function partnerCheck(featureData, form) {
    let partnerField = form.querySelector('#writer');
    partnerField.addEventListener('keyup', e => {
        let siteName = form.querySelector('#site').options[form.querySelector('#site').selectedIndex].value;
        let activePartner = partnerField.value;
        let partner = featureData.filter(item => item.Site === siteName && item.Writer.toLowerCase() === activePartner.toLowerCase())[0];
        if(partner) {
            form.querySelector('#writerID').value = partner.WriterID;
        } else {
            form.querySelector('#writerID').value = '';
        }
    });

}
function addPartner(e) {
    let site = e.currentTarget.querySelector('#site').options[e.currentTarget.querySelector('#site').selectedIndex].value,
        character = e.currentTarget.querySelector('#character').value,
        characterID = e.currentTarget.querySelector('#characterID').value,
        writerID = e.currentTarget.querySelector('#writerID').value,
        writer = e.currentTarget.querySelector('#writer').value;

    sendAjax({
        'SubmissionType': 'new-partner',
        'Site': site,
        'Character': character,
        'CharacterID': characterID,
        'Writer': writer,
        'WriterID': writerID
    }, e);
}