const MATERIALS = [];
const REQUESTS = [];
const POPUPS = [];

// index of attributes in csv row
const REQUEST_ETAT = 0;
const REQUEST_NUM = 1;
const REQUEST_RF = 3;
const REQUEST_PRIORITY = 5;
const REQUEST_LIBELLE = 8;
const REQUEST_STATUT = 10;
const REQUEST_PC = 15;
const REQUEST_MC = 16;
const REQUEST_SC = 17;
const REQUEST_CC = 18;

const REQUEST_STATUT_ALLOWED = ["TRAITÉ", ""];

const LINKED_MATERIALS = [
    ['A001', 'A002'],
    ['B007', 'B008']
];

// Requests color priority (SVG Items)
const YELLOW = '#FFCC00';
const ORANGE = '#FF861D';
const RED = '#ED0000';

// Schema code allowed
const CODE_ALLOWED = ["A", "B"];

// Request file last modified date
var REQUEST_FILE_LAST_MODIFIED = "";