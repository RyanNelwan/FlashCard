
var BoxEvents = {
    shouldOpenBox: 'shouldOpenBox',
}

function Box(boxId,debugId) {
    
    var obj = {
        
        view: null,
        boxId: 0,
        cardModels: [],
        debugId: null,
        
        init: function(){
            this.debugId = debugId;
            this.boxId = boxId;
            this.view = $(' \
                <li class="box" id="box'+boxId+'"> \
                    <div class="inner"> \
                        <div class="content"> \
                            <span class="title">Box #'+boxId+'</span> \
                            <span class="info">'+ this._getBoxInfo() +'</span> \
                            <div class="data"> \
                                <span class="numberOfCards">0</span> \
                                <span> cards</span> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
            ');
            
            $('.boxContainer > .inner').append(this.view);
            this._bind();
            this._update();
        },
        
        addCardModel: function(cardModel){
            this.cardModels.push(cardModel);
            this.view.find('.numberOfCards').text(this.cardModels.length);
            this._update();
        },
        
        _bind: function(){
            var that = this;
            this.view.find('.content').click(function(){
                $.event.trigger(BoxEvents.shouldOpenBox, [that]);
            });
        },
        
        destroy: function(){
            this.view.find('.content').unbind('click');
            this.view.remove();
        },
        
        _getBoxInfo: function(){
            var info = '';
            switch (this.boxId) {
                case 1:
                    info = 'Everyday';
                    break;
                case 2:
                    info = 'Every other day';
                    break;
                case 3:
                    info = 'Once a week';
                    break;
                case 4:
                    info = 'Once every two weeks';
                    break;    
                case 5:
                    info = 'Once a month';
                    break;
                default:
            }
            return info;
        },
        
        _update: function(){
            this.view.data('boxModel', this);
        },
    }
    
    obj.init();
    return obj;
}
