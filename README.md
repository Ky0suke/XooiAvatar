# XooiAvatar

Permet d'afficher les avatars des derniers posteurs à côté de leur pseudo

___


## Installation :

Si les profils de vos membres sont **privés**, collez ceci à la fin du template INDEX_BODY.TPL :

```html
<!-- IF S_USER_LEVEL !== 'ANONYMOUS' -->
<script src="https://rawgit.com/Ky0suke/XooiAvatar/master/XooiAvatar.js"></script>
<script>
let avatar = new XooiAvatar({
    "position": "beforeBegin",
    "width": 25,
    "height": 25,
    "defaultAvatar": "http://img.xooimage.com/files110/8/2/9/noavatar-507cd41.png"
});
</script>
<!-- ENDIF -->
```

Si les profils de vos membres sont **publics**, collez ceci à la fin du template INDEX_BODY.TPL :

```html
<script src="https://rawgit.com/Ky0suke/XooiAvatar/master/XooiAvatar.js"></script>
<script>
let avatar = new XooiAvatar({
    "position": "beforeBegin",
    "width": 25,
    "height": 25,
    "defaultAvatar": "http://img.xooimage.com/files110/8/2/9/noavatar-507cd41.png"
});
</script>
```

___


### Personnalisation

| Paramètre | Description | Valeur | Valeur par défaut |
| ------------- | --------| -------| ------------------|
| position      | Positionne l'avatar avant ou après le pseudo   | **beforeBegin** (avant) ou **afterEnd** (après) | beforeBegin |
| width         | Indique la largeur de l'avatar (en pixel)      | valeur numérique supérieure a zéro      | 25 |
| height        | Indique la hauteur de l'avatar (en pixel)      | valeur numérique supérieure a zéro      | 25 |
| defaultAvatar | Avatar par défaut                              | URL d'une image                         | http://img.xooimage.com/files110/8/2/9/noavatar-507cd41.png |
