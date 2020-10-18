<template>
  <div :class="$.footer">
    <div :class="$.contactus">
      {{$t('10')}}
      <a target="_blank" href="https://medium.com/@ontoswap"><img src="@/assets/image/medium.png" alt=""></a>
      <a target="_blank" href="https://twitter.com/OntoSwap"><img src="@/assets/image/twitter.png" alt=""></a>
      <a target="_blank" href="https://github.com/ontoswap"><img src="@/assets/image/github.png" alt=""></a>
      <a target="_blank" href="https://discord.com/channels/753822804473806956/753822804473806959"><img src="@/assets/image/discord.png" alt=""></a>
      <a target="_blank" href="https://www.facebook.com/Ontoswap-116118243567910/"><img src="@/assets/image/facebook.png" alt=""></a>
      <a target="_blank" href="https://www.reddit.com/r/Ontoswap/new/"><img src="@/assets/image/reddit.png" alt=""></a>
      <a target="_blank" href="https://t.me/ontoswap"><img src="@/assets/image/telegram.png" alt=""></a>
    </div>
    <img :class="$.decorate" src="@/assets/image/footer_decorate.png" alt="">
  </div>
</template>
<style src="./footer.scss" lang="scss" module="$"></style>
<script src="./footer.js"></script>