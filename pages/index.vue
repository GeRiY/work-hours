<template>
  <v-row class="mt-2">
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="cyan"
    ></v-progress-linear>
    <v-col cols="12" v-if="!isLoading">
      <div class="header-actions my-2">
        <v-btn class="ml-2" color="primary" dark @click="exportWorkHours" >Export</v-btn>
      </div>
      <div>
        <!-- Összesítő a workHours-ból -->
        <div class="summary">
          <div class="summary-item">
            <div class="summary-item__title">Összes óra</div>
<!--            user hour format-->
            <div class="summary-item__value">{{ sumHourCount.toLocaleString('hu-HU') }} <v-icon>mdi-clock-time-eight-outline</v-icon></div>
          </div>
          <div style="width: 20%">
            <v-select
              v-model="selectedMount"
              :items="monthsByWorkHours"
              label="Hónap"
              outlined
              dense
            >
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
              </template>
              <template v-slot:prepend-item>
                <v-list-item @click="selectedMount = ''">
                  <v-list-item-content>
                    <v-list-item-title>Összes hónap</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-list-item v-for="(item, index) in monthsByWorkHours" :key="index" @click="selectedMount = item">
                <v-list-item-content>
                  <v-list-item-title>{{ getByFormatDate(item,'YYYY m') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-select>
          </div>
          <div class="summary-item">
            <!-- user money format, show sumFullPriceByIsPaid with it -->
            <div class="summary-item__value">
              Kifizetve:
              {{ sumFullPriceByIsPaid.toLocaleString('hu-HU') }}
              <v-icon>mdi-cash-100</v-icon> /
              {{ sumFullPrice.toLocaleString('hu-HU') }}
              <v-icon>mdi-cash-100</v-icon>
              összesen
            </div>
          </div>
          <div class="summary-item">
            <!-- user money format, show sumFullPriceByIsPaid with it -->
            <div class="summary-item__value">
              Maradék fizetendő:
              {{ parseInt(sumFullPrice-sumFullPriceByIsPaid).toLocaleString('hu-HU') }}
              <v-icon>mdi-cash-100</v-icon>
            </div>
          </div>
        </div>
      </div>
      <v-expansion-panels inset v-if="filteredWorkHours.length">
        <v-expansion-panel v-for="(card, cardIndex) in filteredWorkHours"
                           :key="cardIndex"
                           :style="{ backgroundColor: card.isPaid ? '#c8e6c9' : '#ffcdd2',color: 'black' }"
        >
          <v-expansion-panel-header>
              <span>
                <b>{{ card.workType }}</b>
                <v-icon color="black">mdi-calendar-month</v-icon>
                {{ formatDate(card.createdAt, ' dddd') }}
              </span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <ul style="list-style: none">
              <li><v-icon color="black">mdi-clock-time-two-outline</v-icon><b>Órák száma:</b> {{ card.hourCount ? parseInt(card.hourCount).toLocaleString('hu-HU') : 0 }}</li>
              <li><v-icon color="black">mdi-timetable</v-icon><b>Órabér:</b> {{ card.hourlyPrice ? parseInt(card.hourlyPrice).toLocaleString('hu-HU') : 0 }} Ft</li>
              <li><v-icon color="black">mdi-cash-100</v-icon><b>Teljes összeg:</b> {{ parseInt(card.fullPrice).toLocaleString('hu-HU') }} Ft</li>
              <li><v-icon color="black">mdi-cash-clock</v-icon><b>Kifizetve:</b> {{ card.isPaid ? 'Igen' : 'Nem' }}</li>
              <li><v-icon color="black">mdi-calendar-month</v-icon>{{ formatDate(card.createdAt, ' dddd') }}</li>
            </ul>
            <div class="actions">
              <v-btn color="error" dark @click="removeWorkHour(card.id)">Törlés</v-btn>
              <v-btn :color="card.isPaid ? 'error' : 'success'" @click="toggleIsPaid(card.id)">{{ card.isPaid ? 'Nincs kifitetve' : 'Kifizetve' }}</v-btn>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <p v-else>Nincs találat!</p>
    </v-col>
  </v-row>
</template>

<script>
import {checkOnlyNumber, checkRequired} from '@/utils/validationRules'
import {IS_OPTIONAL, IS_REQUIRED} from '@/utils/constans'
import {newAlert} from '@/utils/alerts'
import CAlert from "@/components/CAlert";
import {getDataFromSheet, insertDataToSheet} from "@/api/sheetBest";
import moment from "moment/moment";
import {removeWorkHourById,setWorkHourById} from "@/api/workHourApi";
import 'moment/locale/hu';

export default {
  name: "index",
  components: {CAlert},
  setup(){
    return {
      checkRequired,
      checkOnlyNumber,
      IS_OPTIONAL,
      IS_REQUIRED,
      moment
    }
  },
  async beforeMount() {
    this.isLoading = true;
    const res = await getDataFromSheet();
    if(res){
      this.workHours = res;
    }
    this.isLoading = false;
  },
  data(){
    return {
      workHours: [], // [{"hourCount":"1","workType":"Traktorozás","hourlyPrice":4000,"fullPrice":4000},{"hourCount":"3","workType":"Egyéb","hourlyPrice":1000,"fullPrice":3000},{"hourCount":"2","workType":"Traktorozás","hourlyPrice":4000,"fullPrice":8000}],
      isLoading: false,
      selectedMount: '',
    };
  },
  computed: {
    sumHourCount(){
      let sum = 0;
      if (!this.filteredWorkHours) return sum;
      console.log('this.filteredWorkHours',this.filteredWorkHours)
      this.filteredWorkHours.forEach((item) => {
        sum += parseInt(item.hourCount);
      })
      return sum;
    },
    sumFullPrice(){
      let sum = 0;
      if (!this.filteredWorkHours) return sum;
      this.filteredWorkHours.forEach((item) => {
        sum += parseInt(item.fullPrice);
      })
      return sum;
    },
    sumFullPriceByIsPaid(){
      let sum = 0;
      if (!this.filteredWorkHours) return sum;
      this.filteredWorkHours.forEach((item) => {
        if(item.isPaid){
          sum += parseInt(item.fullPrice);
        }
      })
      return sum;
    },
    monthsByWorkHours(){
      const months = [];
      this.workHours.forEach((item) => {
        const month = item.createdAt.substring(0,7)
        console.log(month)
        if(!months.includes(month)){
          months.push(month);
        }
      })
      console.log('monthsByWorkHours',months)
      return months;
    },
    filteredWorkHours(){
      if (this.selectedMount === '') return this.workHours;
      const workHours = this.workHours.filter((item) => {
        const month = moment(item.createdAt.trim(),'YYYY-MM-DD HH:mm:ss').locale('hu').format('YYYY-MM');
        return month === this.selectedMount;
      })
      return Array.isArray(workHours) ? workHours : [workHours];
    },
  },
  watch: {},
  methods: {
    formatDate(date, format = ''){
      return moment(date.trim(),'YYYY-MM-DD HH:mm:ss').locale('hu').format('YYYY-MM-DD'+format);
    },
    getWorkhours(){
      this.isLoading = true;
      getDataFromSheet().then(res => {
        if(res){
          this.workHours = res;
        }
        this.isLoading = false;
      })
    },
    async removeWorkHour(id){
      if (!confirm('Biztosan törölni szeretnéd?')) return;
      this.isLoading = true;
      const response = await removeWorkHourById(id)
      if(response){
        this.getWorkhours();
      }
      this.isLoading = false;
    },
    exportWorkHours(){
      const jsonString = JSON.stringify(this.workHours);
      const blob = new Blob([jsonString], {type: "application/json"});
      const url  = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download    = "workHours.json";
      a.href        = url;
      a.textContent = "Download backup.json";
      a.click();
    },
    getByFormatDate(date, format = ''){
      return moment(date.trim()).locale('hu').format(format);
    },
    toggleIsPaid(id){
      const workHour = this.workHours.find((item) => item.id === id);
      if(workHour){
        console.log('togglePaid',workHour)
        workHour.isPaid = !workHour.isPaid;
        console.log('togglePaid',workHour.isPaid)
        setWorkHourById(workHour)
        this.getWorkhours()
      }
    }
  },
}
</script>

<style scoped>
.actions{
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.header-actions{
  display: flex;
  justify-content: flex-start;
}

.summary{
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.summary-item{
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
