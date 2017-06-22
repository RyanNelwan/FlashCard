
var FlashCardElements = {
    
    // Containers
    studyModeContainer: $('#studyModeContainer'),
    deckListContainer: $('#deckListContainerOverflow'),

    // Form
    createDeckForm: $('#createDeckForm'),
    createDeckInputName: $('#deckName'),
    createDeckButton: $("#createDeckButton"),
    
};

function FlashCard(){
    var obj = {

        init: function(){
            this.fetchAllDecks();
            this._bind();
        },

        _bind: function(){
            var that = this;
            FlashCardElements.createDeckForm.submit(function(event){
                event.preventDefault();
                that.createDeck();
            });
        },

        createDeck: function(){
            var that = this;
            var deckName = FlashCardElements.createDeckInputName.val();
            
            if (deckName.length == 0) {
                alert('Please enter a deck name.');
                return;
            }

            var data = {
                'name':deckName,
            };

            Utils.ajax('/deck/create', data, function(response){
                var deckData = response.deck; 
                new Deck(deckData.id, deckData.name, 0);
                FlashCardElements.createDeckInputName.val('');
                that._resolveDeckContainerSize();
            });
        },
        
        fetchAllDecks: function(){
            var that = this;
            Utils.ajax('/deck/fetch_all', null, function(res){
                var decks = res.decks;
                decks.forEach(function(obj){
                    new Deck(obj.id, obj.name, obj.number_of_cards);
                });
                that._resolveDeckContainerSize();
            });
        },
        
        _resolveDeckContainerSize: function(){
            var deck = $('.deck').last();
            var numberOfDecks = $('.deck').length;
            var deckWidth = deck.outerWidth();
            var margin = 20;
            var width = (deckWidth * numberOfDecks) + (numberOfDecks*margin) + deckWidth;
            FlashCardElements.deckListContainer.css('width', width);
        },
    };
    obj.init();
    return obj;
};

$(function(){
    var flashCard = new FlashCard();
});
