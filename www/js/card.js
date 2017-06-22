
function Card(deck, card){
    
    var obj = {
        
        cardId: null,
        view: null,
        deck: null,
        
        question: null,
        answer: null,
        
        
        boxId: 0,
        previousBoxId: 0,
        
        isShowingAnswer: false,
        
        init: function(){
            
            this.deck = deck;
            this.cardId = card.id;
            this.question = card.question;
            this.answer = card.answer;
            this.boxId = card.box_id;
            
            this.view = $(' \
                    <div class="card"> \
                        <div class="inner"> \
                            <div class="question"> \
                                <div class="title">Question:</div> \
                                <div class="value">' + this.question + '</div> \
                            </div> \
                            <div class="answer"> \
                                <div class="title">Answer:</div> \
                                <div class="value">' + this.answer + '</div> \
                            </div> \
                        </div> \
                    </div>'
            );
            
            this.deck.cardsListContainerView.append(this.view);
            
            this._bind();
            this._update();
        },
        
        updateBoxId: function(boxId){
            this.previousBoxId = this.boxId;
            this.boxId = boxId;
            
            Utils.ajax('/deck/card/update_box_id', {'box_id':this.boxId,'card_id':this.cardId}, function(response){
                console.log(response);
            });
        },
        
        _bind: function(){
            var that = this;
            this.view.click(function(event) {
                event.stopPropagation();
                that._toggleAnswer();
            });
        },
        
        _toggleAnswer: function(){
            if (this.view.hasClass('reveal')) {
                this.view.removeClass('reveal');
            } else {
                this.view.addClass('reveal');
            }
        },
        
        _update: function(){
            this.view.data('card', this);
        },
    };
    
    obj.init();
    return obj;
}
