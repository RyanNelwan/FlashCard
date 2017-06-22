
var StudyModeCardEvents = {
    didClickOnCorrectButton: 'didClickOnCorrectButton',
    didClickOnIncorrectButton: 'didClickOnIncorrectButton',
};

function StudyModeCard(studyMode, cardModel){
    var obj = {
        
        view:null,
        correctButton: null,
        incorrectButton: null,
        question: null,
        cardModel: null,
        boxId: 0,
        
        init: function(){
            
            this.cardModel = cardModel;
            this.question = cardModel.question;
            this.boxId = cardModel.boxId;
            
            this.view = $(' \
                <div class="studyModeCard"> \
                    <div class="question"> \
                        <div class="inner"> \
                            <div class="title">Question</div> \
                            <div class="value">'+cardModel.question+'</div> \
                            <div class="instructions">Click to view answer</div> \
                        </div> \
                    </div> \
                    <div class="answer"> \
                        <div class="inner"> \
                            <div class="title">Answer</div> \
                            <div class="value">'+cardModel.answer+'</div> \
                            <div class="response"> \
                                <button class="correctButton">Correct</button><button class="incorrectButton">Incorrect</button> \
                            </div> \
                        </div> \
                    </div> \
                </div> \
            ');
            
            studyMode.view.find('.studyModeCardContainer').append(this.view);
            this.correctButton = this.view.find('.correctButton');
            this.incorrectButton = this.view.find('.incorrectButton');
            this._bind();
        },
        
        _bind: function(){
            var that = this;
            
            this.correctButton.click(function(event){
                event.stopPropagation();
                $.event.trigger(StudyModeCardEvents.didClickOnCorrectButton, that);
                if (that.boxId < 5) {
                    that.boxId++;
                    that.cardModel.updateBoxId(that.boxId);
                }
            });
            
            this.incorrectButton.click(function(event){
                event.stopPropagation();
                $.event.trigger(StudyModeCardEvents.didClickOnIncorrectButton, that);
                that.boxId = 1;
                that.cardModel.updateBoxId(that.boxId);
            });
        },
        
        disposeCard: function(){
            var that = this;
            this.view.animate({
                'margin-top': 100,
                'opacity': 0,
            }, 500, function(){
                that.view.remove();
            });
        }
    };
    
    obj.init();
    
    return obj;
};
