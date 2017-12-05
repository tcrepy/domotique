let panneau = {
    props: {
        add: {default: false},
        nom: String,
        check: {default: 0},
        id: Number
    },
    data: function () {
        return {
            checkVal: this.check,
            isVisible: false,
            newName: '',
            oldName: this.nom,
            pgpio: '',
        }
    },
    template:
        `<div class='contenant'>
            <div class='card'>
                <transition name='rotateZ' appear>
                    <div class='pannel' v-if='!isVisible'>
                        <div id='lamp' v-if='add === false'>
                            <input type='checkbox' name='switch' :checked='this.check == 1' @click='update(id, $event)'/>
                            <label for='switch' class='entypo-lamp'></label>
                            <div class='lamp'>
                                <div class='gonna-give-light'></div>
                            </div>
                            <div class='nom_lampe'>
                                <div class='container'>
                                    <h4>{{this.oldName}}</h4>
                                    <button class='icon' @click='visible'><i class='fa fa-cog'></i></button>
                                </div>
                            </div>
                        </div>
                        <div v-else='add === true'>
                            <i class='icon icon-add fa fa-plus' @click='visible'></i>
                        </div>
                    </div>
                </transition>
                <transition name='rotateZ'>
                    <div class='dialog' v-if='isVisible'>
                        <div v-if="add === false">
                            <div class='params'>
                                <div class='inputs'>
                                    <input type='text' name='newName' v-model='newName' placeholder='Nouveau nom'>
                                </div>
                                <button class="button" @click='updateName(id)'>Changer le nom</button>
                            </div>
                            <div class='suppression'>
                                <button class="button" @click='supprimer(id)'>Supprimer la lampe</button>
                            </div>
                            <i class='icon icon-bs fa fa-remove' @click='visible'></i>
                        </div>
                        <div v-else="add === true">
                            <div class='params'>
                                <div class='inputs'>
                                    <input type='text' name='newName' v-model='newName' placeholder='Nom'>
                                    <input type='text' name='pgpio' v-model='pgpio' placeholder='Port GPIO'>
                                    <button class="button" @click='addLamp()'>Ajouter une lampe</button>
                                </div>
                            </div>
                            <i class='icon icon-bs fa fa-remove' @click='visible'></i>
                        </div>
                    </div>
                </transition>
            </div>
        </div>`,
    methods: {
        update: function (id, event) {
            this.$http.post('http://localhost:8080/update', {'id': id, 'bool': event.target.checked}).then(
                response => {
                    this.result = response.body;
                },
                response => {
                    this.result = {'erreur': 'Impossible de mettre à jour la bdd'};
                    console.log('ERREUR');
                }
            )
        },
        visible(){
            this.isVisible = !this.isVisible;
        },
        updateName(id) {
            this.$http.post('http://localhost:8080/updatename', {'id': id, 'newName': this.newName}).then(
                response => {
                    this.result = response.body;
                    this.oldName = this.newName;
                    this.newName = '';
                },
                response => {
                    this.result = {'erreur': 'Impossible de mettre à jour la bdd'};
                    console.log('ERREUR');
                }
            );
            this.visible();
        },
        supprimer(id){
            this.$http.post('http://localhost:8080/supprimer', {'id': id}).then(
                response => {
                    this.result = response.body;
                },
                response => {
                    this.result = {'erreur': 'Impossible de mettre à jour la bdd'};
                    console.log('ERREUR');
                }
            );
            this.destroy();
        },
        addLamp() {
            this.$http.post('http://localhost:8080/add', {'name': this.newName, 'pgpio': this.pgpio}).then(
                response => {
                    this.result = response.body;
                },
                response => {
                    this.result = {'erreur': 'Impossible de mettre à jour la bdd'};
                    console.log('ERREUR');
                }
            );
            this.visible();
            this.$emit('reload');
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
    mounted: function () {
        this.select()
    },
    methods: {
        select: function (id) {
            this.$http.post('http://localhost:8080/select', {'id': id}).then(
                response => {
                    this.liste = response.body;
                },
                response => {
                    this.liste = {'erreur': 'Impossible de récuperer les informations'};
                }
            )
        }
    },
    components: {
        panneau
    }
});