

function Deck(deckId, deckName, numberOfCards, cards){
    
    var obj = {
        
        view: null,
        formView: null,
        cardsListContainerView: null,
        createNewCardButton: null,
        cancelCreateCardButton: null,
        
        deckId: 0,
        deckName: null,
        cards: null,
        numberOfCards: 0,
        
        didFetch: false,
        didExpand: false,
        
        init: function(){
            // Assign var
            this.deckId = deckId;            
            this.deckName = deckName;
            this.numberOfCards = numberOfCards;
            this.cards = cards !== undefined ? cards : new Array();
            
            var c = this.numberOfCards == 0 ? 'card' : 'cards';
            
            this.view = $(' \
                <div class="deck"> \
                    <div class="inner header"> \
                        <div class="info"> \
                            <button class="openButton">+</button> \
                            <button class="closeButton">-</button> \
                            <div class="deckName">'+ this.deckName +'</div> \
                            <div class="numberOfCards">'+ this.numberOfCards + ' ' + c + '</div> \
                        </div> \
                    </div> \
                    <div class="inner"> \
                        <div class="fold"> \
                            <button class="studyModeButton">Study Mode</button> \
                            <button class="createNewCardButton">Create New Card</button> \
                            <form class="createNewCardForm"> \
                                <input name="question" type="text" placeholder="Question" /> \
                                <input name="answer" type="text" placeholder="Answer" /> \
                                <button class="submitNewCardForm">Create card</button> \
                                <button class="cancelCreateCardButton">Cancel</button> \
                            </form> \
                            <div class="cardsListContainer"></div> \
                        </div> \
                    </div> \
                </div>')
            ;
            
            this.formView = this.view.find('form');
            this.cardsListContainerView = this.view.find('.cardsListContainer');
            this.createNewCardButton = this.view.find('.createNewCardButton');
            this.cancelCreateCardButton = this.view.find('.cancelCreateCardButton');
            
            // Append view
            FlashCardElements.deckListContainer.append(this.view);
            
            this._resolveSize();
            
            // Bind then update
            this._bind();
            this._update();
        },
        
        _bind: function(){
            var that = this;
            
            this.formView.submit(function(event){
                event.preventDefault();
                that._createNewCard();
            });
            
            this.createNewCardButton.click(function(event){
                event.stopPropagation();
                that._toggleFormView();
            });
            
            this.cancelCreateCardButton.click(function(event){
                event.stopPropagation();
                event.preventDefault();
                that._toggleFormView();
                return false;
            });
            
            this.view.find('.openButton').click(function(event){
                that._fetchCards();
            });
            
            this.view.find('.closeButton').click(function(event){
                that._contractView();
            });
            
            this.view.find('.studyModeButton').click(function(event){
                event.stopPropagation();
                that._startStudyMode();
            });
            
            this.view.find('input').click(function(event){
                event.stopPropagation();
                return false;
            });
        },
        
        _expandView: function(){
            this.didExpand = true;
            this.view.addClass('expand');
        },
        
        _contractView: function(){
            this.didExpand = false;
            this.view.find('.cardsListContainer').empty();
            this.view.removeClass('expand');
        },
        
        _toggleFormView: function(){
            if (this.formView.is(':hidden')) {
                this.formView.show();
                this.createNewCardButton.hide();
            } else {
                this.formView.hide();
                this.createNewCardButton.show();
            }
        },
        
        _startStudyMode: function(){
            new StudyMode(this);
        },
        
        _resolveSize: function(){
            var windowHeight = FlashCardElements.deckListContainer.outerHeight();
        },
        
        _fetchCards: function(){
            var that = this;
            this.didFetch = true;
            this.cards = [];
            Utils.ajax('/deck/card/fetch_all', {deck_id:this.deckId}, function(response){
                var cards = response.cards;
                cards.forEach(function(card){
                    var c = new Card(that, card);
                    that.cards.push(c);
                });
                that._expandView();
            });
        },
        
        _createNewCard: function(){
            
            var that = this;
            var question = this.formView.find('input[name="question"]').val();
            var answer = this.formView.find('input[name="answer"]').val();
            
            if (question.length == 0 || answer.length == 0) {
                return console.log('Missing required fields.');
            }
            
            var data = {
                deck_id: this.deckId,
                question: question,
                answer: answer,
            };
            
            Utils.ajax('/deck/card/create', data, function(response){
                var c = new Card(that, response.card);
                that.cards.push(c);
                that.formView.find('input[name="question"]').val('');
                that.formView.find('input[name="answer"]').val('');
                that._resolveNumberOfCards();
            });
        },
        
        _resolveNumberOfCards: function(){
            var c = this.cards.length == 0 ? 'card' : 'cards';    
            this.view.find('.numberOfCards').text(this.cards.length + ' ' + c);
        },
        
        _update: function(){
            this.view.data('deck', this);
        },
    };
    
    obj.init();
    return obj;
}
