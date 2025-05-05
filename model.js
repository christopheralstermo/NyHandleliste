model = {
    app: {
        currentView: 'frontPage',
    },

    inputs: {
        nyBruker: {
            id: null,
            antall: null,
            vare: null,
            prisPr: null,
        },
        editMode: {
            antall: null,
            vare: null,
            prisPr: null,
        }
    },

    data: {
        checkedSum: 0,
        lista: [
            {
                id: 1,
                antall: 1,
                vare: "hundeposer",
                prisPr: 30,
                isPicked: false,
                editMode: false,
                prioritet: false,
            },
            {
                id: 2,
                antall: 1,
                vare: "brød",
                prisPr: 35,
                isPicked: false,
                editMode: false,
                prioritet: false,
            },
            {
                id: 3,
                antall: 1,
                vare: "vaskesvamp",
                prisPr: 10,
                isPicked: false,
                editMode: false,
                prioritet: false,
            },
            {
                id: 4,
                antall: 1,
                vare: "håndsåpe",
                prisPr: 30,
                isPicked: false,
                editMode: false,
                prioritet: false,
            },
            {
                id: 5,
                antall: 1,
                vare: "engangstørkefiller",
                prisPr: 20,
                isPicked: false,
                editMode: false,
                prioritet: false,
            },
        ],
    },
};