
function StudyMode(deckModel) {
    var obj = {
        
        deckModel: null,
        currentBoxModel: null,
        
        view: null,
        resultsListView: null,
        resultsView: null,
        boxContainerView: null,
        
        numberOfBoxes: 5,
        cards: [],
        boxModels: [],
        debugId: 0,
        
        init: function(){
            var that = this;
            this.debugId = Math.floor(Date.now() / 1000);
            this.deck = deckModel;        
            this.view = $(' \
                <div> \
                    <div id="boxTitle">Box #1</div> \
                    <div class="closeButton">X</div> \
                    <ul class="boxContainer"> \
                        <div class="inner"> \
                             \
                        </div> \
                    </ul> \
                    <div id="results"> \
                        <button>Done</button> \
                        <div> \
                            <div id="resultsIncorrect"> \
                                <span class="title">Incorrect</span> \
                                <span class="value">2</span> \
                            </div> \
                            <div id="resultsCorrect"> \
                                <span class="title">Correct</span> \
                                <span class="value">5</span> \
                            </div> \
                        </div> \
                        <ul id="resultsList"> \
                            <li class="title"> \
                                <span class="column">Question</span> \
                                <span class="column3">New Box #</span> \
                                <span class="column2">Previous Box #</span> \
                            </li> \
                        </ul> \
                    </div> \
                    <div class="studyModeCardContainer"> \
                        <!-- <div class="studyModeCard"> \
                            <div class="question">  \
                                <div class="inner"> \
                                    Question \
                                </div> \
                            </div> \
                            <div class="answer"> \
                                <div class="inner"> \
                                    Answer \
                                    <div class="response"> \
                                        <button class="correctButton">Correct</button><button class="incorrectButton">Incorrect</button> \
                                    </div> \
                                </div> \
                            </div> \
                        </div> \
                    </div> \
                </div>'
            );
            
            $('#studyModeContainer').show();
            $('#studyModeContainer').html(this.view);
            
            this.boxContainerView = this.view.find('.boxContainer');
            this.resultsView = this.view.find('#results');
            this.resultsListView = this.view.find('#resultsList');
            
            this._renderCards();
            this._bind();
            
            that._createBoxes();
            that._distributeCards();
            this._update();
        },
        
        _bind:function(){
            var that = this;
            
            this.view.observe(BoxEvents.shouldOpenBox, function(event, boxModel){
                if (that.view == null) return;
                that._openBox(boxModel);
            });
            
            this.view.observe(StudyModeCardEvents.didClickOnCorrectButton, function(event, studyModeCardModel){
                if (that.view == null) return;
                that.view.find('.studyModeCard').removeClass('flipped');
                setTimeout(function(){
                    studyModeCardModel.disposeCard();
                    var numberOfActiveCards = $('.studyModeCard').length - 1;
                    if (numberOfActiveCards == 0) {
                        setTimeout(function(){
                            that._showResults();
                        },500);
                    }
                }, 500);
            });
            
            this.view.observe(StudyModeCardEvents.didClickOnIncorrectButton, function(event, studyModeCardModel){
                if (that.view == null) return;
                that.view.find('.studyModeCard').removeClass('flipped');
                setTimeout(function(){
                    studyModeCardModel.disposeCard();    
                    var numberOfActiveCards = $('.studyModeCard').length - 1;
                    if (numberOfActiveCards == 0) {
                        setTimeout(function(){
                            that._showResults();
                        },500);
                    }
                }, 500);
            });
            
            this.view.find('.closeButton').click(function(event){
                event.stopPropagation();
                that.boxModels = [];
                $('#studyModeContainer').empty();
                $('#studyModeContainer').hide();
            });
            
            this.resultsView.find('button').click(function(){
                that._closeResults();
            });
            
            this.view.find('.studyModeCardContainer').click(function(event){
                event.stopPropagation();
                if (that.view.find('.studyModeCard').hasClass('flipped')) {
                    that.view.find('.studyModeCard').removeClass('flipped');
                } else {
                    that.view.find('.studyModeCard').addClass('flipped');
                }
            });
        },
        
        _openBox: function(boxModel){
            // Begin session!
            var that = this;
            var cardModels = boxModel.cardModels;
            
            if (cardModels.length == 0) {
                return alert('No cards found for selected box.');
            }
            
            this.view.find('.studyModeCardContainer').show();
            this.view.find('#boxTitle').text('Box #' + boxModel.boxId).show();
            cardModels.forEach(function(cardModel){
                var studyModeCardModel = new StudyModeCard(that, cardModel);
            });
            
            this.currentBoxModel = boxModel;
            this.boxContainerView.hide();
        },
        
        _showResults: function(){
            var that = this;
            var titleCopy = this.resultsListView.find('.title').clone();
            
            var numberOfCorrects = 0;
            var numberOfIncorrects = 0;
            
            this.resultsView.show();
            this.resultsListView.empty();
            this.resultsListView.append(titleCopy);
            this.view.find('.studyModeCardContainer').empty().hide();
            
            this.currentBoxModel.cardModels.forEach(function(cardModel){
                var result = $('  \
                    <li class="clearfix"> \
                        <span class="question">'+cardModel.question+'</span> \
                        <span class="boxId">'+cardModel.boxId+'</span> \
                        <span class="previousBoxId">'+cardModel.previousBoxId+'</span> \
                    </li> \
                ');
                that.resultsListView.append(result);
                
                if (cardModel.previousBoxId >= cardModel.boxId) {
                    numberOfIncorrects++;
                    result.addClass('red');
                } else {
                    numberOfCorrects++;
                    result.addClass('green');
                }
            });
            
            this.resultsView.find('#resultsIncorrect .value').text(numberOfIncorrects);
            this.resultsView.find('#resultsCorrect .value').text(numberOfCorrects);
        },
        
        _closeResults: function(){
            this.resultsView.hide();
            this.view.find('#boxTitle').text('').hide();
            this.boxContainerView.find('.inner').empty();
            this.boxModels = [];
            this._createBoxes();
            this._distributeCards();
            this.boxContainerView.show();
        },
        
        _closeBox: function(){
            this.boxContainerView.show();
        },
        
        _createBoxes: function(){
            for (var i = 0; i < 5; i++) {
                var boxModel = new Box(i + 1, this.debugId);
                this.boxModels.push(boxModel);
            }
        },
        
        _distributeCards: function(){
            var that = this;
            this.deck.cards.forEach(function(cardModel){
                var boxId = cardModel.boxId;
                var boxIndex = boxId - 1;
                that.boxModels[boxIndex].addCardModel(cardModel);
            });
        },
        
        _renderCards: function(){
            this.view.show();
        },
        
        _update: function(){
            this.view.data('studyModeModel', this);
        },
    };
    
    obj.init();
    return obj;
};
