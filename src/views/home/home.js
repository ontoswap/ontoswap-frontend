import messages from './locale'
import Title from '../../components/title/title.vue'
import SubTitle from '../../components/title/subTitle.vue'
import BalanceCard from '../../components/balanceCard/balanceCard.vue'
import Space from '../../components/space/space.vue'
import { 
  getTotalSupply,
  getRewardPerBlock,
  getAvailableBalance,
  getRewardLP,
  getHomepageBalance
} from '../../funs/index'
import { getBalanceNumber } from "../../utils/format";
import { pairs } from '../../config/constant'

export default {
  name: 'Home',
  i18n: { messages },
  components: {
    Title,
    SubTitle,
    BalanceCard,
    Space,
  },
  data() {
    return {
      balanceContent: {
        title: this.$t('40'),
        subTitle: this.$t('50'),
        number: 0,
        subNumber: 0,
        lock: true
      },
      totalSupplyContent: {
        title: this.$t('60'),
        subTitle: this.$t('70'),
        number: 0,
        subNumber: 0,
      },
    }
  },
  mounted() {
    this.getSurvey()

  },
  methods: {
    getSurvey(){
      getTotalSupply().then(res => {
        this.totalSupplyContent.number = getBalanceNumber(res)
      })
      getRewardPerBlock().then(res => {
        this.totalSupplyContent.subNumber = getBalanceNumber(res)
      })
    },
    getPresonInfo(){
      getAvailableBalance().then(res => {
        this.balanceContent.number = getBalanceNumber(res)
      })
      // let rewards = []
      // for(let item in pairs){
      //   rewards.push(getRewardLP(pairs[item].id))
      // }
      // Promise.all(rewards).then(res => {
      //   const pedingReward = res.reduce((pre, next) => {
      //     return pre + Number(next) 
      //   }, 0)
      //   this.balanceContent.subNumber = getBalanceNumber(pedingReward)
      // })
      // getHomepageBalance(4, (res) => {
      //   console.log(res)
      // })
    }
  },
  watch: {
    '$store.state.wallet.address'(address, oldAddress) {
      if (!oldAddress && address) {
        this.getPresonInfo();
      }
    }
  },
}