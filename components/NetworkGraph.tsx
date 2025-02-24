import { FC, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { ComponentBaseProps } from '../types';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

interface NetworkNode {
  id: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  metadata?: {
    creationDate?: string;
    lastUpdatedDate?: string;
    description?: string;
  };
  category?: string;
  imageUrl?: string;
}

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale); {
}

interface NetworkLink {
  source: string;
  target: string;
}

interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

interface NetworkGraphProps extends ComponentBaseProps {
  data: NetworkData;
  filterCriteria?: (node: NetworkNode) => boolean;
} {
}

const NetworkGraph: FC<NetworkGraphProps> = ({ data, filterCriteria, className }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 600;

    const filteredNodes = filterCriteria ? data.nodes.filter(filterCriteria) : data.nodes;
    const filteredLinks = data.links.filter(link => 
      filteredNodes.some(node => node.id === link.source) && 
      filteredNodes.some(node => node.id === link.target)
    );

    const simulation = d3.forceSimulation<NetworkNode>(filteredNodes)
      .force('link', d3.forceLink<NetworkNode, NetworkLink>(filteredLinks).id(d => d.id).strength(1))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(filteredLinks)
      .enter().append('line')
      .attr('stroke-width', 2)
      .attr('stroke', '#999')
      .attr('class', 'link')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('stroke', '#555');
        d3.select('#tooltip')
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY + 5}px`)
          .style('display', 'inline-block')
          .html(`Source: ${d.source}<br>Target: ${d.target}`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke', '#999');
        d3.select('#tooltip').style('display', 'none');
      });

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(filteredNodes)
      .enter().append('circle')
      .attr('r', 10)
      .attr('fill', d => d.category ? colorScale(d.category) : '#69b3a2')
      .attr('class', 'node')
      .call(d3.drag<SVGCircleElement, NetworkNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('mouseover', function(event, d) {
        d3.select(this).attr('stroke', '#555');
        d3.select('#tooltip')
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY + 5}px`)
          .style('display', 'inline-block')
          .html(`ID: ${d.id}<br>Description: ${d.metadata?.description}<br>Creation Date: ${d.metadata?.creationDate}<br>Last Updated: ${d.metadata?.lastUpdatedDate}`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke', null);
        d3.select('#tooltip').style('display', 'none');
      });

    node.append('title')
      .text(d => d.id);

    simulation
      .nodes(filteredNodes)
      .on('tick', ticked);

    simulation.force<d3.ForceLink<NetworkNode, NetworkLink>>('link')
      ?.links(filteredLinks);

    function ticked() {
      link
        .attr('x1', d => (d.source as NetworkNode).x ?? 0)
        .attr('y1', d => (d.source as NetworkNode).y ?? 0)
        .attr('x2', d => (d.target as NetworkNode).x ?? 0)
        .attr('y2', d => (d.target as NetworkNode).y ?? 0);

      node
        .attr('cx', d => d.x ?? 0)
        .attr('cy', d => d.y ?? 0);
    }

    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, NetworkNode, NetworkNode>, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, NetworkNode, NetworkNode>, d: NetworkNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, NetworkNode, NetworkNode>, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    svg.call(d3.zoom<SVGSVGElement, unknown>()
      .extent([[0, 0], [width, height]])
      .scaleExtent([1, 8])
      .on('zoom', zoomed));

    function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
      svg.attr('transform', event.transform.toString());
    }

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(20,20)');

    const categories = Array.from(new Set(filteredNodes.map(d => d.category).filter(Boolean)));

    categories.forEach((category, i) => {
      legend.append('rect')
        .attr('x', 0)
        .attr('y', i * 20)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', colorScale(category));

      legend.append('text')
        .attr('x', 20)
        .attr('y', i * 20 + 10)
        .text(category);
    });

    const tooltip = d3.select('body').append('div')
      .attr('id', 'tooltip')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('display', 'none')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', '#fff')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('pointer-events', 'none');
  }, [data, filterCriteria]);

  return (
    <svg 
      ref={svgRef} 
      width="800" 
      height="600" 
      className={`network-graph ${className}`}
    ></svg>
  );
};

export default NetworkGraph;
