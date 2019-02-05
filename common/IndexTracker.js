function CycleIndexTracker (trackedArray, resetIndex){
    var currentIndex = resetIndex || 0;
    var increment = 1;

    function normIndex(i){
        return (trackedArray.length + i) % trackedArray.length;
    }

    const api =  {
        whatNext(step = 1){
            return normIndex(currentIndex + increment * step)
        },
        whatPrev(step = 1){
            return normIndex(currentIndex - increment * step)
        },
        whatIndex(){
          return currentIndex;
        },
        getCurrent(){
            return trackedArray[currentIndex];
        },
        moveNext(step = 1){
            currentIndex = this.whatNext(step);
            return this.getCurrent();
        },
        movePrev(step = 1){
            currentIndex = this.movePrev(step);
            return this.getCurrent();
        },
        updateIncrement(inc){
            increment = inc;
        },
        reverse(){
            increment *= -1;
        },
        reset(){
            currentIndex = resetIndex || 0;
        }


    };

    return api;
}

exports.CycleIndexTracker = CycleIndexTracker;
