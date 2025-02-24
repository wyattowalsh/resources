import { FC, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { ComponentBaseProps } from '../types';

interface NetworkNode {
  id: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
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
}

const NetworkGraph: FC<NetworkGraphProps> = ({ data, className }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 600;

    const simulation = d3.forceSimulation<NetworkNode>(data.nodes)
      .force('link', d3.forceLink<NetworkNode, NetworkLink>(data.links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('stroke-width', 2)
      .attr('stroke', '#999');

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('r', 10)
      .attr('fill', '#69b3a2')
      .call(d3.drag<SVGCircleElement, NetworkNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('title')
      .text(d => d.id);

    simulation
      .nodes(data.nodes)
      .on('tick', ticked);

    simulation.force<d3.ForceLink<NetworkNode, NetworkLink>>('link')
      ?.links(data.links);

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
  }, [data]);

  return (
    <svg 
      ref={svgRef} 
      width="800" 
      height="600" 
      className={className}
    ></svg>
  );
};

export default NetworkGraph;