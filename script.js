let theSelection='lifeExpectancy.csv'

const margin = ({top: 20, right: 40, bottom: 40, left: 20})
const width=750-margin.left-margin.right,
	  height=300-margin.top-margin.bottom

let svg=d3.select('.Chart').append('svg')
	  .attr('width',width+margin.left+margin.right)
	  .attr('height',height+margin.top+margin.bottom)
	  .append('g')
	  .attr('transform','translate('+margin.left+','+margin.top+')')

let xScale=d3.scaleTime()
	  .range([10,width+10])
  
let yScale=d3.scaleLinear()
	  .range([height,0])

let xAxis=d3.axisBottom()
	  .scale(xScale)
	  
let yAxis=d3.axisLeft()
	  .scale(yScale)
  
svg.append('g')
	  .attr('class','x-axis')
svg.append('g')
	  .attr('class','y-axis')
	
svg.append('text')
	.attr('class','y-title')
	.attr('x',-10)
	.attr('y',-5)

svg.append('text')
	.attr('class','x-title')
	.attr('x',width-20)
	.attr('y',height+30)
	.text('Year')

function lineChart(selection,country){
	d3.csv(selection,d3.autoType).then(data=>{
		
		data=data.filter(d=>d['Country Name']==country)
		data=Object.entries(data[0]).map(([key, value]) => ({key,value}))
		data.map(x=>x.key=new Date(x.key,1,1))
		const len=data.length
		data=data.slice(0,len-2)

		xScale.domain(d3.extent(data,d=>d.key))
		yScale.domain([d3.min(data,d=>d.value),d3.max(data,d=>d.value)])

		var line=d3.line()
			.x(function(d){
				return xScale(d.key)
			})
			.y(function(d){
				return yScale(d.value)
			})


		var lines=svg.selectAll('.lineChart')
			.data([data])

		
		lines.enter()
			.append('path')
			.attr('class','lineChart')
			.merge(lines)
			.attr("d", line)
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-width", 1.5)

		lines.exit()
			.remove()
		

		svg.select('.x-axis')
			.call(xAxis)
			.attr('transform',`translate(0,${height})`)
		
		svg.select('.y-axis')
			.call(yAxis)
			.attr('transform',`translate(10,0)`)
		if(theSelection=='lifeExpectancy.csv'){
			svg.select('.y-title')
				.text('Life Expectancy')
		} else{
			svg.select('.y-title')
				.text('CO2 Emission')
		}

	})
}

lineChart(theSelection,'Aruba')

const dropdownElement=document.querySelector("#line-type");
dropdownElement.addEventListener('change',(event)=>{
	if(event.target.value==='expectancy'){
		theSelection='lifeExpectancy.csv'
		lineChart(theSelection,'Aruba')
	} else{
		theSelection='CO2Emissions.csv'
		lineChart(theSelection,'Aruba')
	}
})

