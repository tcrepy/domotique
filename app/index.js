let panneau = {
    props: {
        nom: String,
        check: {default: 0},
        id: Number
    },
    data: function () {
        return {
            checkVal: this.check,
            isVisible: false,
            newName: ''
        }
    },
    template:
        "<div class='contenant'>" +
            "<div class='card'>" +
                "<transition name='rotateZ' appear>" +
                    "<div class='pannel' v-if='!isVisible'>" +
                        "<div id='lamp'>" +
                            "<input type='checkbox' name='switch' :checked='this.check == 1' @click='update(id, $event)'/>" +
                            "<label for='switch' class='entypo-lamp'></label>" +
                            "<div class='lamp'>" +
                                "<div class='gonna-give-light'></div>" +
                            "</div>" +
                            "<div class='nom_lampe'>" +
                                "<div class='container'>" +
                                    "<h4>{{nom}}</h4>" +
                                    "<button class='icon' @click='visible'><i class='fa fa-cog'></i></button>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</transition>" +
                "<transition name='rotateZ'>" +
                    "<div class='dialog' v-if='isVisible'>" +
                        "<div class='params'>" +
                            "<div class='inputs'>" +
                                "<input type='text' name='newName' v-model='newName' placeholder='Nouveau nom'>" +
                            "</div>" +
                            "<button @click='updateName(id)'>Changer le nom</button>" +
                        "</div>" +
                        "<div class='suppression'>" +
                            "<button @click='supprimer(id)'>Supprimer la lampe</button>" +
                        "</div>" +
                        "<i class='icon fa fa-remove' @click='visible'></i>" +
                    "</div>" +
                "</transition>" +
            "</div>" +
        "</div>",
    methods: {
        update: function (id, event) {
            this.$http.post('http://localhost:8080/update', {'id': id, 'bool': event.target.checked}).then(
                response => {
                this.result = response.body;
            },
                response => {
                    this.result = {'erreur':'Impossible de mettre à jour la bdd'};
                    console.log('ERREUR');
                }
            )
        },
        visible(){
            this.isVisible = !this.isVisible;
        },
        updateName(id) {
            //TODO::update du nom
            console.log(this.newName);
            console.log(id);
            this.$http.post('http://localhost:8080/updatename', {'id': id , 'newName': this.newName}).then(
                response => {
                    this.result = response.body;
                },
                response => {
                    this.result = {'erreur':'Impossible de mettre à jour la bdd'};
                    console.log('ERREUR');
                }
            );
            this.visible();
        },
        supprimer(id){
          console.log(id);
            this.$http.post('http://localhost:8080/supprimer', {'id': id }).then(
                response => {
                    this.result = response.body;
                },
                response => {
                    this.result = {'erreur':'Impossible de mettre à jour la bdd'};
                    console.log('ERREUR');
                }
            );
            this.visible();
        }
    }
};

let vue4 = new Vue({
    el: '#domotique',
    data: {
        liste: [],
        result: [],
        etatCheck: ''
    },
    mounted: function(){
        this.select()
    },
    methods: {
        select: function (id) {
            this.$http.post('http://localhost:8080/select', {'id':id}).then(
                response => {
                    this.liste = response.body;
                },
                response => {
                    this.liste = {'erreur':'Impossible de récuperer les informations'};
                }
            )
        }
    },
    components: {
        panneau
    }
});