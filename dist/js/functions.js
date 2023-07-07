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
function formatThread(siteURL, status, character, feature, title, threadID, icDate, partner, type, lastPost, delayClass) {
    let html = `<div class="thread status--${status} ${character.split(' ')[0]} delay--${delayClass} type--${type.split(' ')[0]} partner--${partner.split('#')[0].replace(' ', '')} grid-item">
        <a class="thread--character" href="${siteURL}/?showuser=${character.split('#')[1]}">${character.split('#')[0]}</a>
        <a href="${siteURL}/?showtopic=${threadID}&view=getnewpost" target="_blank" class="thread--title">${title}</a>
        <span class="thread--feature">ft. <a href="${siteURL}/?showuser=${feature.split('#')[1]}">${feature.split('#')[0]}</a></span>
        <span class="thread--partners">Writing with <a href="${siteURL}/?showuser=${partner.split('#')[1]}">${feature.split('#')[0]}</a></span>
        <span class="thread--ic-date">Set ${icDate}</span>
        <span class="thread--last-post">Last Active ${lastPost}</span>
    </div>`;

    return html;
}
function populatePage(array) {
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

        html += formatThread(siteURL,
                            array[i].Status.toLowerCase(),
                            array[i].Character.toLowerCase(),
                            array[i].Featuring.toLowerCase(),
                            array[i].Title.toLowerCase(),
                            array[i].ThreadID,
                            array[i].ICDate.toLowerCase(),
                            array[i].Partner.toLowerCase(),
                            array[i].Type.toLowerCase(),
                            array[i].LastUpdated.toLowerCase(),
                            getDelay(array[i].LastUpdated));
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
    //initialize isotope
    // quick search regex
    let qsRegex;
    let elements = document.querySelectorAll(gridItem);

    // init Isotope
    $(window).on('load', function() {
        $container.isotope({
            itemSelector: gridItem,
            percentPosition: true,
            masonry: {
                columnWidth: '.grid-sizer',
                gutter: 15
            },
            filter: defaultShow,
            getSortData: {
                character: '.thread--character',
                name: '.thread--title',
                icdate: '.thread--ic-date',
                lastpost: '.thread--last-post',
            },
            sortAscending: {
                character: true,
                name: true,
                icdate: false,
                lastpost: true,
            }
        });
    });
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