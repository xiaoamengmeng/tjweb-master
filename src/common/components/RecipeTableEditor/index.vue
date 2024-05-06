<template>
  <div class="recipe-table-editor">
    <recipe-table
      @edit-meal="editMeal"
      :hide-edit="hideEdit"
      :hide-tags-close="hideTagsClose"
    ></recipe-table>
    <recipe-editor
      ref="recipeEditor"
      :active.sync="periodActive"
      :data.sync="recipeData"
      :visible.sync="dialogVisible"
      @save="saveRecipe"
    ></recipe-editor>
  </div>
</template>

<script>
import RecipeTable from '../RecipeTable'
import RecipeEditor from '../RecipeEditor'

export default {
  name: 'RecipeTableEditor',
  components: {
    RecipeTable,
    RecipeEditor
  },
  provide() {
    return {
      rdata: () => this.recipeData,
      active: () => this.periodActive
    }
  },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    hideEdit: Boolean,
    hideTagsClose: Boolean,
  },
  data() {
    return {
      periodActive: 'breakfast',
      recipeData: [],
      dialogVisible: false,
      currPane: {},
    }
  },
  watch: {
    value(n) {
      this.recipeData = n
    },
    recipeData: {
      deep: true,
      handler: function (value) {
        if (value.length === 0) return
        this.$emit('input', value)
      }
    }
  },
  methods: {
    editMeal(row) {
      this.periodActive = row.period
      this.currPane = this.recipeData.find(item => item.period === this.periodActive)
      this.dialogVisible = true
    },
    saveRecipe(data) {
      this.recipeData = data
    },
    getParams() {
      const params = {}
      params.calories = this.caloriesSum
      params.foods = []
      this.recipeData.forEach(item => {
        if (item.meal.length !== 0) {
          item.meal.forEach(food => {
            food.food_id = food.food.id
            if (this.type === 'edit') {
              food.recipe = this.recipeId
            }
            params.foods.push(food)
          })
        }
      })
      return params
    },
  }, // methods end
  computed: {
    caloriesSum() {
      let sum = 0
      this.recipeData.forEach((item) => {
        item.meal.forEach((food) => {
          if(food.weight === 0) return
          sum += food.weight / 100 * food.calories
        })
      })
      return Math.round(sum)
    },
  }
}
</script>

<style scoped lang="less">

</style>
