class XooiAvatar {
    /**
     * @constructor
     *
     * @param {Object} options - Options du script
     * @param {string} options.position - Position de l'avatar
     * @param {number} options.width - largeur de l'avatar (en px)
     * @param {number} options.height - hauteur de l'avatar (en px)
     */
    constructor(options) {
            // Initialisation des options par défaut
            this.setDefaultOptions();
            // Définition des options spécifiées par l'utilisateur
            if (options) {
                for (let prop in options) {
                    if (options.hasOwnProperty(prop) && this.options.hasOwnProperty(prop)) {
                        this.options[prop] = options[prop];
                    }
                }
            }
            // Récupération des différentes lignes du tableau principal du forum
            this.getRows();
            // Récupération des utilisateurs
            this.getUsers();
            // Récupération et affichage des avatars
            this.getAvatars();
        }
    /**
     * Applique les options par défaut
     */
    setDefaultOptions() {
            this.options = {
                "position": "beforeBegin",
                "width": 25,
                "height": 25,
                "defaultAvatar": "http://img110.xooimage.com/files/8/2/9/noavatar-507cd41.png"
            };
        }
    /**
     * Cherche et récupère le parent d'un élèment HTML
     *
     * @param {Object} node - Element HTML enfant
     * @param {String} target - Nom de la balise parent la plus proche
     */
    static getParent(node, target) {
            if ((node && typeof node === 'object') && (target && typeof target === 'string')) {
                /** @type {Boolean} */
                let parentFound = false;
                while (!parentFound) {
                    node = node.parentNode;
                    if (!node) {
                        break;
                    }
                    if (node.nodeName === target) {
                        parentFound = true;
                        break;
                    }
                }
                if (parentFound) return node;
            } else {
                throw '"node" parameter is undefined or not an object, "target" parameter is undefined or not a string';
            }
        }
    /**
     * Récupère les lignes du tableau principal
     */
    getRows() {
            /** @type {Array} */
            this.rows = [];
            /** @type {HTMLElement} */
            var forumLinks = (document.querySelector('span.forumlink')) ? document.querySelectorAll('span.forumlink') : document.querySelectorAll('span.topictitle');
            forumLinks = Array.from(forumLinks);
            for (let link of forumLinks) {
                /** @type {HTMLElement} */
                var parent = XooiAvatar.getParent(link, 'TR');
                // Si nous ne pouvons pas trouver un td ayant les classes row1 ou row2,
                                 // Cela signifie que l'utilisateur a activé l'option "icône forum"
                                 // Donc, nous avons besoin de trouver le précédent TR
                if (parent && !parent.querySelector('td.row1, td.row2')) parent = XooiAvatar.getParent(parent, 'TR');
                if (parent) this.rows.push(parent);
            }
        }
    /**
     * Récupère le nom d'utilisateur ainsi que l'identifiant des derniers posteurs
     */
    getUsers() {
            /** @type {Object} */
            this.users = {};
            for (let row of this.rows) {
                /** @type {HTMLElement} */
                const userLink = row.querySelector('td:last-child a[href^=profile]');
                if (userLink) {
                    /** @type {String} */
                    const userName = userLink.textContent || userLink.innerText,
                        /** @type {Number} */
                        userId = userLink.href.split('&u=')[1],
                        /** @type {Object} */
                        user = {
                            "userName": userName
                        };
                    // Si l'utilisateur n'existe pas dans notre objet et que son ID est supérieur à zéro ...
                    if (!(userId in this.users) && userId > 0) {
                        // ajoute le
                        this.users[userId] = user;
                    }
                }
            }
        }
    /**
     * Récupère les avatars des utilisateurs
     */
    getAvatars() {
            for (let userId in this.users) {
                var params = {
                    "mode": "viewprofile",
                    "u": userId,
                    "ajax": 1
                };
                // Requête ajax sur son profil
                this.request('profile.php', params, (response) => {
                    if (!response.responseURL) {
                        // Edge ne prend pas en charge responseURL, fixons cela ...
                        params = XooiAvatar.convertObjectToParamsString(params);
                        response.responseURL = `${location.protocol}//${location.hostname}/profil.php?${params}`;
                    }
                    // Trouve l'avatar dans le DOM et affiche le
                    this.getAvatar(response);
                });
            }
        }
    /**
     * Récupèrel'avatar d'un utilisateur
     *
     * @param {Object} response - réponse de la requête ajax
     */
    getAvatar(response) {
            if (response && typeof response === 'object') {
                /** @type {HTMLElement} */
                const wrapper = document.createElement('div');
                wrapper.innerHTML = response.responseText;
                /** @type {String} */
                const avatar = wrapper.querySelector('img.photo'),
                    /** @type {Number} */
                    userId = XooiAvatar.getUserId('fromURL', response.responseURL);
                // Enregistre l'avatar
                if (userId && avatar) this.users[userId].avatar = avatar.src;
                // Affiche l'avatar
                if (userId) this.setAvatar(userId);
            } else {
                throw '"response" parameter is undefined or not an object';
            }
        }
    /**
     * Affiche l'avatar d'un utilisateur
     *
     * @param {Number} userId - identifiant de l'utilisateur
     */
    setAvatar(userId) {
            if (userId && typeof userId === 'number') {
                /** @type {String} */
                const userName = this.users[userId].userName,
                    /** @type {String} */
                    avatar = this.users[userId].avatar || this.options.defaultAvatar;
                for (let row of this.rows) {
                    /** @type {HTMLElement} */
                    var td = row.querySelectorAll('td');
                    if (td) {
                        td = td[td.length - 1];
                        /** @type {HTMLElement} */
                        const userLink = td.querySelector('a[href^=profile]');
                        if (userLink) {
                            /** @type {String} */
                            const userLinkText = userLink.textContent;
                            if (userLinkText === userName) {
                                userLink.insertAdjacentHTML(this.options.position, `<img src="${avatar}" style="width: ${this.options.width}px; height: ${this.options.height}px; vertical-align: middle; margin: 5px;">`);
                            }
                        }
                    }
                }
            } else {
                throw '"userId" parameter is not defined or not a number';
            }
        }
    /**
     * Lance une requête ajax (GET)
     *
     * @param {String} url - URL cible
     * @param {Object} params - Paramètres
     * @param {Object} callback - fonction de rappel
     */
    request(url, params, callback) {
            if (url && typeof url === 'string') {
                if (params && typeof params === 'object') {
                    params = XooiAvatar.convertObjectToParamsString(params);
                    url = `${url}?${params}`;
                }
                /** @type {Object} */
                const xhttp = new XMLHttpRequest();
                xhttp.open('GET', url, true);
                xhttp.onreadystatechange = (data) => {
                    if (data.target.readyState === 4 && data.target.status === 200) {
                        const response = data.target;
                        if (callback) {
                            callback(response);
                        } else {
                            return response;
                        }
                    }
                };
                xhttp.send();
            } else {
                throw '"url" parameter is undefined or not a string';
            }
        }
    /**
     * Transforme un objet contenant des paramètres en chaine de caractères
     *
     * @param {Object} obj - Liste de paramètres
     */
    static convertObjectToParamsString(obj) {
            if (obj && typeof obj === 'object') {
                const str = Object.keys(obj).map(function(key) {
                    return `${key}=${obj[key]}`;
                }).
                join('&');
                return str;
            } else {
                throw '"obj" parameter is undefined or not an object';
            }
        }
    /**
     * Récupère l'identifiant d'un membre
     *
     * @param {String} method - Mode de récupération (via l'URL de la page, ou le DOM)
     * @param {String} input - Chaine de caractères a tester
     */
    static getUserId(method, input) {
        method = (method) ? method : 'fromURL';
        if (input && typeof input === 'string') {
            /** @type {RegExp} */
            let regex;
            if (method === 'fromURL') regex = /u=([0-9]+)/;
            else if (method === 'fromDOM') regex = /user-id-([0-9+])/;
            if (regex.test(input)) return Number(input.match(regex)[1]);
        } else {
            throw '"input" parameter is undefined or not a string';
        }
    }
}
