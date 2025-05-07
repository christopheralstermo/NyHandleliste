function updateView() {
    // Oppdaterer visningen i DOM med HTML fra thePages
    document.getElementById('app').innerHTML = /*HTML*/`
    ${thePages()}
    `;
};

function thePages() {
    // Velger hvilken side som skal vises basert på currentView
    let theView = '';
    switch(model.app.currentView){
        case 'frontPage':
            theView = theFrontPageView();
            break;
    };
    return theView;
};

function theFrontPageView() {
    // Genererer HTML for forsiden med inputfelt og tabell
    let html = '';
    html += /*HTML*/`
        <div class="input-container">
            <input style="font-size: 30px;" id="antallInputten" type="number" placeholder="Antall" onchange="model.inputs.nyBruker.antall = this.value">
            <input style="font-size: 30px;" id="vareInputten" type="text" placeholder="Vare" onchange="model.inputs.nyBruker.vare = this.value">
            <input style="font-size: 30px;" id="prisInputten" type="number" placeholder="Pris" onchange="model.inputs.nyBruker.prisPr = this.value">
            <button style="font-size: 30px;" onclick="save()">Lagre</button>
        </div>
    `;
    html += '<div class="table-container"><table class="item-table">';
    html += /*html*/`
        <tr class="table-header">
            <th>Første pri</th>
            <th>Har plukket</th>
            <th>Vare</th>
            <th>Antall</th>
            <th>Pris pr</th>
            <th>Total sum</th>
            <th></th>
            <th></th>
        </tr>
        ${vareHtml()}
        <tr class="table-footer">
            <td>Total: ${summen('prioritet', 'prisPr', 'antall', true)} kr</td>
            <td>Total: ${summen('isPicked', 'prisPr', 'antall', false)} kr</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    `;
    html += '</table></div>';
    return html;
};

function vareHtml() {
    // Genererer HTML for hver vare i listen, sortert etter isPicked og vare
    let html = '';
    let listaMi = model.data.lista.slice().sort((a, b) => {
        if (a.isPicked === b.isPicked) {
            return a.vare.localeCompare(b.vare, 'nb', { sensitivity: 'base' });
        }
        return a.isPicked ? 1 : -1;
    });
    for (let index in listaMi) {
        html += /*html*/`
        <tr class="table-row" style="--row-index: ${index};">
            <td><input ${listaMi[index].prioritet ? 'checked' : ''}
                type="checkbox"
                id="Prioritet_${listaMi[index].id}"
                class="custom-checkbox"
                onchange="kryssetAv(this, ${listaMi[index].id}, 'prioritet')"
                >
            </td>
            <td><input ${listaMi[index].isPicked ? 'checked' : ''} 
                id="harPlukketCheckboxen_${listaMi[index].id}"
                class="custom-checkbox"
                type="checkbox" 
                onchange="kryssetAv(this, ${listaMi[index].id}, 'isPicked')"
                >
            </td>
            <td>${listaMi[index].vare}</td>
            <td>${!listaMi[index].editMode ? `${listaMi[index].antall} stk` : /*html*/`
            <input
                style="font-size: 30px;"
                id="editAntallInputten"
                class="input-field"
                type="number" 
                onchange="model.inputs.editMode.antall = this.value"
            >`}
            </td>
            <td>${!listaMi[index].editMode ? `${!listaMi[index].isPicked ? listaMi[index].prisPr : ''} kr` : /*HTML*/`
                <input
                    style="font-size: 30px;"
                    id="editPrisInputten"
                    class="input-field"
                    type="number" 
                    onchange="model.inputs.editMode.prisPr = this.value"
                >`}
            </td>
            <td>${!listaMi[index].editMode ? `${listaMi[index].antall * listaMi[index].prisPr}` : ''} kr</td>
            <td>${!listaMi[index].editMode ? 
                `<button class="edit-button" onclick="editTheLine(${listaMi[index].id})">Rediger</button>` :
                `<button class="save-edit-button" onclick="saveEdit(${listaMi[index].id})">Lagre</button>`}
             </td>
            <td><button class="delete-button" onclick="deleteItem(${listaMi[index].id})">Slett</button></td>
        </tr>
        `;
    }
    return html;
};

function kryssetAv(checkbox, id, denBoolske) {
    // Oppdaterer avmerkingsstatus for prioritet eller isPicked basert på id
    let item = model.data.lista.find(item => item.id === id);
    if (item) {
        item[denBoolske] = checkbox.checked;
    }
    saveToLocalStorage();
    updateView();
};

function saveEdit(id) {
    // Lagrer endringer fra redigeringsmodus
    for (item of model.data.lista) {
        if (item.id === id) {
            item.editMode = false;
            item.antall = model.inputs.editMode.antall;
            item.prisPr = model.inputs.editMode.prisPr;
        }
    }
    saveToLocalStorage();
    updateView();
};

function editTheLine(id) {
    // Setter et element i redigeringsmodus
    let handleLista = model.data.lista;
    for (item of handleLista) {
        if (item.id === id) {
            item.editMode = true;
        }
    }
    updateView();
};

function deleteItem(id) {
    // Sletter et element fra listen
    let handleLista = model.data.lista;
    for (item of handleLista) {
        if (item.id === id) {
            handleLista.splice(handleLista.indexOf(item), 1);
        }
    }
    saveToLocalStorage();
    updateView();
};

function save() {
    // Lagrer en ny vare i listen
    let antall = Number(model.inputs.nyBruker.antall);
    let vare = model.inputs.nyBruker.vare ? model.inputs.nyBruker.vare.trim() : '';
    let prisPr = Number(model.inputs.nyBruker.prisPr);
    let id = model.inputs.nyBruker.id;

    if (antall > 0 && vare !== '' && prisPr > 0) {
        id = model.data.lista.length + 1;
        let nyttObjektIHandlelista = {
            id,
            antall,
            vare,
            prisPr,
            isPicked: false,
            editMode: false,
            prioritet: false,
        };
        model.data.lista.push(nyttObjektIHandlelista);
        saveToLocalStorage();
    }
    updateView();
};

function summen(denBoolske, verdi1, verdi2, trueOrFalse) {
    // Beregner summen for elementer basert på en boolsk verdi
    const sum = model.data.lista.reduce((total, item) => {
        if (item[denBoolske] === trueOrFalse) {
            return total + (item[verdi1] * item[verdi2]);
        }
        return total;
    }, 0);
    return sum;
}

function saveToLocalStorage() {
    // Lagrer listen til localStorage
    localStorage.setItem('handleListenMin', JSON.stringify(model.data.lista));
}

//localStorage.removeItem("handleListenMin");

function loadFromLocalStorage() {
    // Laster listen fra localStorage
    const storedLista = localStorage.getItem('handleListenMin');
    if (storedLista) {
        model.data.lista = JSON.parse(storedLista);
    }
}

document.addEventListener('DOMContentLoaded', loadFromLocalStorage);