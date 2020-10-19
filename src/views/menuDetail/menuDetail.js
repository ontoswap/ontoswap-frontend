import Vue from "vue";
import messages from './locale'
import Title from '../../components/title/title.vue'
import SubTitle from '../../components/title/subTitle.vue'
import Space from '../../components/space/space.vue'
import MenuCard from '../../components/menuCard/menuCard.vue'
import Deposit from '../../components/deposit/deposit.vue'

import { mapState } from "vuex";
import { pairs, YFODIST_HASH, MAX_NUMBER } from '../../config/constant'
import {
  putApprove,
  getAvaliableLP,
  getStakedLP,
  getRewardLP,
  getAllowance,
  putDeposit,
  putWithdrawAll
} from '../../funs/index'
import { getDisplayBalance, getDisplayLP, getFullDisplayBalance } from "../../utils/format";

export default {
  name: 'MenuDetail',
  i18n: { messages },
  components: {
    Title,
    SubTitle,
    Space,
    MenuCard,
    Deposit
  },
  data() {
    return {
      type: "",
      harvesting: false,
      approving: false,
      unstaking: false,
      rewardsLp: "0.0000",
      stakedLp: "0.0000",
      deposit: {
        dialogVisible: false,
        available: 0,
        onCancel: this.onCancel,
        onDeposit: this.onDeposit,
        pending: false
      },
      unstakeContent: {
        dialogVisible: false,
        available: 0,
        onCancel: this.onCancelUnstake,
        onDeposit: this.onUnstake,
        pending: false
      },
      allowanceAmount: 0,
    }
  },
  mounted() {
    this.type = this.$route.params.type;
    Vue.nextTick(() => {
      this.getPresonInfo();
    });
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
    }),
    hash() {
      return pairs[this.type] && pairs[this.type].hash;
    },
    pid() {
      return pairs[this.type] && pairs[this.type].id;
    },
    harvestimg() {
      return this.type && require(`../../assets/image/${this.type.split('-')[0]}.png`);
    },
    stakingimg() {
      return this.type && require(`../../assets/image/${this.type.split('-')[1]}.png`);
    },
    isUnlock() {
      return !!this.address;
    },
    isApprove() {
      return this.allowanceAmount - 2 ** 32 <= 0;
    }
  },
  watch: {
    address(address, oldAddress) {
      if (!oldAddress && address) {
        this.getPresonInfo();
      }
    }
  },
  methods: {
    getPresonInfo() {
      if (!this.$store.state.wallet.address) return;
      getAvaliableLP(pairs[this.type].hash).then(res => {
        this.deposit.available = getFullDisplayBalance(res);
      });
      getStakedLP(pairs[this.type].id).then(res => {
        this.stakedLp = res.amount;
        this.unstakeContent.available = getFullDisplayBalance(res.amount);
      });
      getRewardLP(pairs[this.type].id).then(res => {
        this.rewardsLp = getDisplayBalance(res);
      });
      const { netVersion, address } = this.$store.state.wallet
      const allowanceAmount = localStorage.getItem(`${this.type}-${address}-${netVersion}`)
      this.allowanceAmount = allowanceAmount || 0
      this.getAllowance(pairs[this.type].hash, YFODIST_HASH)
    },
    harvest() {
      this.harvesting = true;
      putWithdrawAll(pairs[this.type].id, 0, (err, tx) => {
        if (!err) {
          this.transferBoxVisible = true;
          this.coinCode = this.type + ' FLP';
          this.coinAmount = this.stakedLp;
          this.tx = tx;
        }
      })
        .then(res => {
          this.harvesting = false;
          getRewardLP(pairs[this.type].id).then(res => {
            this.rewardsLp = getDisplayBalance(res);
          });
        });
    },
    approve() {
      this.approving = true;
      putApprove(pairs[this.type].hash, (err, tx) => {
        if (!err) {
          this.transferBoxVisible = true;
          this.coinCode = '';
          this.coinAmount = '';
          this.tx = tx;
        }
      })
        .then(res => {
          this.approving = false;
          this.allowanceAmount = MAX_NUMBER;
          const { netVersion, address } = this.$store.state.wallet
          localStorage.setItem(`${this.type}-${address}-${netVersion}`, this.allowanceAmount)
        }).catch(err => {
          this.approving = false;
        });
    },
    unstake() {
      this.unstakeContent.dialogVisible = true;
    },
    onUnstake(amount) {
      this.unstakeContent.pending = true;
      putWithdrawAll(pairs[this.type].id, amount, (err, tx) => {
        if (!err) {
          this.transferBoxVisible = true;
          this.coinCode = this.type + ' FLP';
          this.coinAmount = amount;
          this.tx = tx;
        }
      })
        .then(res => {
          this.unstakeContent.pending = false;
          this.unstakeContent.dialogVisible = false;
          getStakedLP(pairs[this.type].id).then(res => {
            this.stakedLp = res.amount;
            this.unstakeContent.available = getFullDisplayBalance(res.amount);
          });
          getAvaliableLP(pairs[this.type].hash).then(res => {
            this.deposit.available = getFullDisplayBalance(res);
          });
        });
    },
    onCancelUnstake() {
      this.unstakeContent.dialogVisible = false;
    },
    stake() {
      this.deposit.dialogVisible = true;
    },
    onDeposit(amount) {
      this.deposit.pending = true;
      putDeposit(pairs[this.type].id, amount, (err, tx) => {
        if (!err) {
          setTimeout(() => {
            this.transferBoxVisible = true;
            this.tx = tx;
            this.coinCode = this.type + ' FLP';
            this.coinAmount = amount;
          }, 600)
        }
      })
        .then(res => {
          this.deposit.pending = false;
          this.deposit.dialogVisible = false;
          getStakedLP(pairs[this.type].id).then(res => {
            this.stakedLp = res.amount;
            this.unstakeContent.available = getFullDisplayBalance(res.amount);
          });
          getAvaliableLP(pairs[this.type].hash).then(res => {
            this.deposit.available = getFullDisplayBalance(res);
          });
        }
        );
    },
    onCancel() {
      this.deposit.dialogVisible = false;
    },
    getAllowance(addressHash, spendHash) {
      getAllowance(addressHash, spendHash).then(res => {
        this.allowanceAmount = res;
        const { netVersion, address } = this.$store.state.wallet
        localStorage.setItem(`${this.type}-${address}-${netVersion}`, this.allowanceAmount)
      });
    },
    formatDisplay(num) {
      return getDisplayLP(num)
    },
  }
}