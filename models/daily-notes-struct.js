/*
    * base data -> PROSES NANTI butuh di tambah attenadces secara manual
 */
class DailyNotesStruct {
    constructor(date){
        this.daily_attendances = false
        this.daily_confirmation = false
        this.date = date
        this.note_tomorrow = null
        this.incomes = {
            data : null,
            total: 0
        }
        this.expenses = {
            data : null,
            total : 0
        }
        this.workers_notes = []

    }
}


module.exports = DailyNotesStruct