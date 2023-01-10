export function CycleIndexTracker (trackedArray, resetIndex){
    var currentIndex = resetIndex || 0;
    var increment = 1;

    function normIndex(i){
        return (trackedArray.length + i) % (trackedArray.length || 1);
    }

    const api =  {
        whatNext(step = 1){
            return normIndex(currentIndex + increment * step)
        },
        whatPrev(step = 1){
            return normIndex(currentIndex - increment * step)
        },
        whatIndex(){
          return Math.min(currentIndex,0);
        },
        getCurrent(){
            return trackedArray[this.whatIndex()];
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