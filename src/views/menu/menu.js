import messages from './locale'
import Title from '../../components/title/title.vue'
import SubTitle from '../../components/title/subTitle.vue'
import Space from '../../components/space/space.vue'
import MenuCard from '../../components/menuCard/menuCard.vue'
import { pairs } from '../../config/constant'

export default {
  name: 'Menu',
  i18n: { messages },
  components: {
    Title,
    SubTitle,
    Space,
    MenuCard
  },
  data() {
    return {
      items: [],
    }
  },
  mounted() {
    this.formatItems()
  },
  watch: {
    '$i18n.locale'() {
      this.formatItems()
    },
  },
  methods: {
    goMenuDetail({type}){
      if(!this.$store.state.wallet.address) return this.$message('Pelese Unlock Wallet!')
      this.$router.push(`/menu/${type}`)
    },
    formatItems() {
      const tmp = [
        {
          type: 'OSWAP-USDT',
          title: 'OSWAP',
          subTitle: `${this.$t('30')} OSWAP-USDT SLP<br />${this.$t('40')} YFO`,
        },
        {
          type: 'YFO-USDT',
          title: 'YFO',
          subTitle: `${this.$t('30')} YFO-USDT SLP<br />${this.$t('40')} YFO`,
        },
        {
          type: 'DAI-USDT',
          title: 'DAI',
          subTitle: `${this.$t('30')} DAI-USDT SLP<br />${this.$t('40')} YFO`,
        }
      ];

      this.items = tmp.map((item, index) => ({
        ...item, 
        ...pairs[item.type], 
        apy: '200.00',
        onTab: this.goMenuDetail
      }));
    },
    
  }
}